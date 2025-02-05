# Smart BPMN by Vision Arc

## Description

Smart BPMN by Vision Arc is a platform that simplifies the creation, management, version tracking, and sharing of BPMN diagrams. Specially designed for enterprise teams of business analysts or enterprise architects, it provides an intuitive interface to streamline workflow design, collaboration, and documentation.

## Table of Contents

- [Smart BPMN by Vision Arc](#smart-bpmn-by-vision-arc)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Running the Frontend](#running-the-frontend)
    - [Running the Backend](#running-the-backend)
  - [Running Locally with Virtual Environment](#running-locally-with-virtual-environment)
  - [Contributors](#contributors)
  - [Contact](#contact)

---

## Installation

**Clone the repository**:

```bash
git clone https://gitlab.hrz.tu-chemnitz.de/vsr/edu/planspiel/ws2425/group04-visionarc.git
```

---

### Running the Frontend

1. Create environment file

```bash
cd group04-visionarc
cp .env.example .env
```

Provide values to all the environment variable keys in  `.env`:

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Running the Backend

1. Create environment file:

  ```bash
  cd src/backend
  cp .env.example .env
  ```

  Add your Groq API key to `.env`:

  ```env
  GROQ_API_KEY=your_api_key_here
  ```

2. Running with Docker:

- Build and start the container:
  
```bash
docker-compose up --build
```

3. Access the application at:

- [http://localhost:7860](http://localhost:7860)


## Running Locally with Virtual Environment

1. Create a virtual environment:

    ```bash
    python3 -m venv .venv
    ```

2. Navigate to the backend folder:

    ```bassh
    cd path_to_backend_folder
    ```

3. Activate the virtual environment:
    - Windows:
  
      ```bash
      .venv\Scripts\activate
      ```

    - macOS/Linux:
  
      ```bash
      source .venv/bin/activate
      ```

4. To run the app use :

    ```bash
    uvicorn app:app --reload 
    ```

5. To deactivate the virtual environment when finished:

    ```bash
    deactivate
    ```

## Contributors

The following contributors are from GitHub, mapped to their corresponding GitLab profiles:

| Contributor Name | GitHub Profile | Gitlab Profile
|-------------|----------------|----------------|
| Eshwari Suhas Kangutkar | [@EshwariK](https://github.com/EshwariK) | [@kesh-at-tu-chemnitz.de](https://gitlab.hrz.tu-chemnitz.de/kesh-at-tu-chemnitz.de)
| Omkar Mirgal | [@OmkarMirgal](https://github.com/OmkarMirgal) | [@ommi-at-tu-chemnitz.de](https://gitlab.hrz.tu-chemnitz.de/ommi-at-tu-chemnitz.de)
| Roshita Shakya | [@roshita02](https://github.com/roshita02) | [@rosha-at-tu-chemnitz.de](https://gitlab.hrz.tu-chemnitz.de/rosha-at-tu-chemnitz.de)
| Shrusti Dilip Sakala | [@ShrushtiSakala](https://github.com/ShrushtiSakala) | [@saks-at-tu-chemnitz.de](https://gitlab.hrz.tu-chemnitz.de/saks-at-tu-chemnitz.de)
| Toushika Islam | [@toushika111](https://github.com/toushika111) | [@islt-at-tu-chemnitz.de](https://gitlab.hrz.tu-chemnitz.de/islt-at-tu-chemnitz.de) 

## Contact

If you have any queries, please reach out to us on [visionarc.chemnitz@gmail.com](mailto:visionarc.chemnitz@gmail.com)
