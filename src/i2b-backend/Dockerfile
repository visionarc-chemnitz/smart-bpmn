FROM python:3.12 AS backend
RUN mkdir /app
WORKDIR /app

ARG BACKEND_MODE=production
ARG BACKEND_PORT=7860

ENV BACKEND_MODE=${BACKEND_MODE}
ENV BACKEND_PORT=${BACKEND_PORT}

COPY bpmn_redrawer_backend bpmn_redrawer_backend/
RUN [ -f bpmn_redrawer_backend/detectron_model/final_model.pth ] && echo "Object Detection model found" || { echo "Object Detection model not found!"; wget -O bpmn_redrawer_backend/detectron_model/final_model.pth https://huggingface.co/PROSLab/BPMN-Redrawer-Models/resolve/main/final_model.pth; }
RUN [ -f bpmn_redrawer_backend/detectron_model/kp_final_model.pth ] && echo "KeyPoint Prediction model found" || { echo "KeyPoint Prediction model not found!"; wget -O bpmn_redrawer_backend/detectron_model/kp_final_model.pth https://huggingface.co/PROSLab/BPMN-Redrawer-Models/resolve/main/kp_final_model.pth; }

RUN apt-get install -y apt-transport-https
RUN echo 'deb https://notesalexp.org/tesseract-ocr-dev/bullseye/ bullseye main' >> /etc/apt/sources.list
RUN wget -O - https://notesalexp.org/debian/alexp_key.asc | apt-key add -
RUN apt-get update

# Install libicu67 from a different source
RUN wget https://deb.debian.org/debian/pool/main/i/icu/libicu67_67.1-7_amd64.deb
RUN dpkg -i libicu67_67.1-7_amd64.deb

RUN apt-get install -y tesseract-ocr

COPY requirements.txt ./
RUN pip install -U pip
RUN pip install -r requirements.txt
RUN pip install --no-build-isolation git+https://github.com/facebookresearch/detectron2.git

CMD uvicorn --host 0.0.0.0 --port ${BACKEND_PORT} --factory bpmn_redrawer_backend.app:create_app

EXPOSE ${BACKEND_PORT}
