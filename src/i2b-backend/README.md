---
title: Test
emoji: ⚡
colorFrom: red
colorTo: gray
sdk: docker
pinned: false
---
Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference

---
# BPMN Redrawer

This folder contains the backend code for BPMN Redrawer, developed at University of Camerino.

## Prerequisites
- [Python 3.8](https://www.python.org/downloads/) or greater;
- [virtualenv](https://pypi.org/project/virtualenv/);
- [Tesseract 5.0](https://github.com/tesseract-ocr/tessdoc/blob/main/Installation.md);
- The Object Prediction model (to be copied to [bpmn_redrawer_backend/detectron_model/final_model.pth](bpmn_redrawer_backend/detectron_model/final_model.pth));
- The KeyPoint Prediction model (to be copied to [bpmn_redrawer_backend/detectron_model/kp_final_model.pth](bpmn_redrawer_backend/detectron_model/kp_final_model.pth)).

## Virtual Environment
From the [backend](./) folder:
- Create a virtual environment:
    ```bash
    virtualenv venv
    ```
- Activate the virtual environment:
    ```bash
    # Windows
    venv\Scripts\activate
    # Linux
    source venv/bin/activate
    ```
- Install the requirements from [requirements.txt](requirements.txt) or [requirements-dev.txt](requirements-dev.txt):
    ```bash
    pip install -r requirements.txt
    #or
    pip install -r requirements-dev.txt
    ```
- Install [Detectron2 v0.6](https://github.com/facebookresearch/detectron2/releases/tag/v0.6):
    ```bash
    pip install git+https://github.com/facebookresearch/detectron2.git@v0.6
    ```
- Launch the application
    ```bash
    python bpmn_redrawer_backend/app.py
    ```

---
# References

This project is based on the [BPMN-Redrawer](https://github.com/PROSLab/BPMN-Redrawer) project. For more details, you can refer to the research paper: [BPMN-Redrawer: An Open Source Tool for Redrawing BPMN Diagrams](https://ceur-ws.org/Vol-3216/paper_246.pdf).

## Modifications

- Updated initial image processing to directly pass numpy arrays for further processing without storing the image.
- Updated model initiation to load the model at the start of the application, allowing each request to use the pre-loaded model.

BPMN-Redrawer is open source, enabling anyone to access the code, apply changes, train new machine learning models starting from different datasets of BPMN images, and easily deploy them.
---