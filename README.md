\# **Product Discovery with AI Assist**



\## Overview



This project is a mini product discovery application built using:



\- FastAPI (Backend)

\- React (Vite) (Frontend)

\- AI-powered query handling (mock implementation)



Users can:

\- Browse available products

\- Ask natural language questions (e.g., "cheap laptop")

\- Receive relevant product recommendations



---



**##  Tech Stack**



**### Backend**

\- Python

\- FastAPI

\- Pydantic

\- CORS Middleware

\- Mock AI logic (keyword-based matching)



**### Frontend**

\- React (Vite)

\- useState \& useEffect hooks

\- Reusable components (ProductCard)

\- Modern CSS styling



---



**## How to Run the Project**



**###  Run Backend**

cd backend

venv\\Scripts\\activate

uvicorn main:app --reload



Backend runs at:

http://127.0.0.1:8000



API Docs available at:

http://127.0.0.1:8000/docs



**###  Run Frontend**

cd frontend

npm install

npm run dev



Frontend runs at:

http://localhost:5173



**### API Endpoints**

**GET /api/products**



Returns the list of products.

**POST /api/ask**



Request:

{

&nbsp; "query": "cheap laptop"

}



Response:

{

&nbsp; "product\_ids": \["P002"],

&nbsp; "summary": "Found 1 matching products based on your query."

}



**## Environment Variables**



This project originally supports OpenAI API integration.

If integrating with OpenAI, create a '.env' file inside the 'backend/' folder:



OPENAI\_API\_KEY=sk-proj-PJMBaIAO\_GYCoXpCivjEkqHXf\_eVB1dBygC\_xJ4HazSVhnuqeuoUrKiV7qwBMYU5mhPJdND-YGT3BlbkFJJSrH3yM2cYLPQ3e1kUpKUk46Bs0K2qasbXbMNvDSMobmsKtsfBUqewR0zvB2mAglhh9asWTkkA



Note: The current implementation uses mock AI logic for demonstration.



**## Features Implemented**



\- End-to-end full-stack integration

\- REST API design

\- Structured JSON responses

\- CORS handling

\- Reusable React components

\- Loading state handling

\- Clean responsive UI



**## Future Improvements**



\- Integrate real LLM (OpenAI API)

\- Add product detail page

\- Add advanced filtering options

\- Add authentication

\- Deploy using Vercel (Frontend) + Render (Backend)

