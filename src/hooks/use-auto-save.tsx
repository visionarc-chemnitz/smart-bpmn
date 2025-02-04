import { useCallback, useEffect, useMemo, useRef } from 'react';
import { saveBPMN } from '@/app/_services/user/user.service';
import { useParams } from 'next/navigation';
import debounce from 'lodash/debounce';

interface AutoSaveOptions {
  xml: string;
  bpmnId: string;
  currentVersionId: string;
  userId: string;
  enabled: boolean;
  onSaveStart?: () => void;
  onSaveComplete?: () => void;
  onSaveError?: (error: any) => void;
}

export function useAutoSave({
  xml,
  bpmnId,
  currentVersionId,
  userId,
  enabled,
  onSaveStart,
  onSaveComplete,
  onSaveError,
}: AutoSaveOptions) {
  const { fileId } = useParams<{ fileId: string }>();
  const lastSavedXmlRef = useRef<string | null>(null);
  const latestXmlRef = useRef(xml);
  const isSavingRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);
  const prevFileIdRef = useRef<string | undefined>(fileId);

  // Update latestXmlRef when xml changes
  useEffect(() => {
    latestXmlRef.current = xml;
  }, [xml]);

  // On initial mount, set lastSavedXmlRef
  useEffect(() => {
    if (isInitialMountRef.current && xml) {
      lastSavedXmlRef.current = xml;
      isInitialMountRef.current = false;
    }
  }, [xml]);

  // Debounced save function waiting 5 seconds
  const debouncedSave = useMemo(
    () =>
      debounce(async () => {
        // Skip saving during initial mount
        if (isInitialMountRef.current) return;

        const currentXml = latestXmlRef.current;
        if (!enabled || currentXml === lastSavedXmlRef.current || isSavingRef.current)
          return;

        try {
          isSavingRef.current = true;
          onSaveStart?.();

          await saveBPMN(bpmnId, currentVersionId, userId, currentXml);

          // Update last saved XML on success
          lastSavedXmlRef.current = currentXml;
          onSaveComplete?.();
        } catch (error) {
          onSaveError?.(error);
        } finally {
          isSavingRef.current = false;
        }
      }, 5000),
    [bpmnId, currentVersionId, userId, enabled, onSaveStart, onSaveComplete, onSaveError]
  );

  // Save before window unload: flush debounced call immediately
  useEffect(() => {
    const handleBeforeUnload = () => {
      debouncedSave.flush();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [debouncedSave]);

  // Save on route changes: flush if fileId changes to a new value
  useEffect(() => {
    if (
      prevFileIdRef.current !== fileId &&
      fileId !== undefined &&
      prevFileIdRef.current !== undefined
    ) {
      debouncedSave.flush();
      prevFileIdRef.current = fileId;
    }
  }, [fileId, debouncedSave]);

  // Save on unmount: flush pending save
  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  useEffect(() => {
    debouncedSave();
  }, [xml, debouncedSave]);
}