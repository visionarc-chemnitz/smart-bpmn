import { useCallback, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { saveBPMN } from '@/app/_services/user/user.service';

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
  onSaveError
}: AutoSaveOptions) {
  const lastSavedXmlRef = useRef<string | null>(null);
  const isSavingRef = useRef<boolean>(false);

  useEffect(() => {
    if (enabled && xml && !lastSavedXmlRef.current) {
      lastSavedXmlRef.current = xml;
    }
  }, [enabled, xml]);

  const debouncedSave = useCallback(
    debounce(async (newXml: string) => {
      if (!enabled || newXml === lastSavedXmlRef.current || isSavingRef.current) return;

      console.log('lastSavedXmlRef.current:', lastSavedXmlRef.current);
      console.log('newXml:', newXml);

      try {
        isSavingRef.current = true;
        onSaveStart?.();
        
        await saveBPMN(
          bpmnId,
          currentVersionId,
          userId,
          newXml,
        );
        
        lastSavedXmlRef.current = newXml;
        onSaveComplete?.();
      } catch (error) {
        onSaveError?.(error);
      } finally {
        isSavingRef.current = false;
      }
    }, 2000),
    [bpmnId, currentVersionId, userId, onSaveStart, onSaveComplete, onSaveError]
  );

  useEffect(() => {
    if (xml && xml !== lastSavedXmlRef.current) {
      debouncedSave(xml);
    }

    return () => {
      debouncedSave.cancel();
    };
  }, [xml, debouncedSave]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (xml !== lastSavedXmlRef.current) {
        debouncedSave.flush();
      }
    };
  }, []);
}