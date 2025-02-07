import os

# import fastapi modules
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from xhtml2pdf import pisa

# import services
from services import ChatService

# import json
import json
import tempfile

# load environment variables
from dotenv import load_dotenv
load_dotenv()

# create FastAPI app
app = FastAPI()

# allowed origins
origins = [
  "http://localhost:3000",
]

# cors middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


# endpoint to check the status of the backend
@app.get("/")
def check_status():
  return JSONResponse(
    content={ "status_code": status.HTTP_200_OK, "message": "Backend FastAPI is running" }
  )

# instantiate the chat service
chat_service = ChatService(
    groq_api_key=os.getenv("GROQ_API_KEY"),
)

# endpoint to start a chat session
# supports server-sent events (SSE)
@app.post("/chat")
async def chat_endpoint(request: Request):
    try:
        # Parse the request body
        body = await request.json()
        message = body.get("message", "").strip()
        thread_id = body.get("thread_id", "").strip()
        # xml = body.get("xml", "").strip()

        if not message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message is required"
            )
        
        if not thread_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Thread ID is required"
            )

        async def generate():
            try:
                config = await chat_service.get_thread_config(thread_id)
                
                print(f"request: {body} config: {config}, message: {message}")
                
                # Parse the xml - fetch comments and return those comments then ask use to confirm if he want to update xml based on those comments.
                # if yes then trigger the whole generation again but with different prompts.

                async for chunk in chat_service.process_message(message, config):
                  yield f"data: {json.dumps({'response': chunk, 'thread_id': config['configurable']['thread_id']})}\n\n"
                
                # print(f"app response: {await chat_service.get_thread_history(config.get('configurable').get('thread_id'))}")
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.post("/thread-history")
async def get_thread_history(request: Request):
  try:
    body = await request.json()
    thread_id = body.get("thread_id", "").strip()
    value = body.get("value", "").strip()
    
    if not thread_id:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Thread ID is required"
      )
      
    config = await chat_service.get_thread_config(thread_id)
    history = await chat_service.get_thread_history(config,value)
    
    if history is None or 'messages' not in history:
      return []
    else :
      messages = [{"role": "assistant" if message.type == "ai" else "user", "content": message.content} for message in history['messages']]
    return messages
    
  except Exception as e:
    print(f"Error: {str(e)}")
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=str(e)
    )

@app.post("/generate-arc42")
async def generate_arc42(request: Request):
    try:
        body = await request.json()
        thread_id = body.get("thread_id", "").strip()
        
        if not thread_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Thread ID is required"
            )
        
        config = await chat_service.get_thread_config(thread_id)
        markdown_content = await chat_service.generate_arc42_doc(config)
        if markdown_content is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No thread history found"
            )
        
        html_content = markdown2.markdown(markdown_content)
        
         # Wrap the content in a container div with a sky blue border
        styled_html_content = f"""
        <html>
            <head>
                <style>
                    
                   h2 {{
                        color: #2E86C1;
                        font-size: 1.5em;
                        margin-bottom: 0.5em
                    }}
                </style>
            </head>
            <body>
            <div class="header">
            </div>
                <div class="pdf-container">
                    {html_content}
                </div>
            </body>
        </html>
        """
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
            pdf_file = tmp.name
            pisa_status = pisa.CreatePDF(styled_html_content, dest=tmp)
            tmp_path = tmp.name
        
        if pisa_status.err:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating PDF"
            )
        
        return FileResponse(
            path=tmp_path,
            filename="arc42_documentation.pdf",
            media_type="application/pdf"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
        
        
if __name__ == '__main__':
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)