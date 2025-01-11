from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
import base64
from fastapi.responses import JSONResponse
from typing import Optional

load_dotenv()

app = FastAPI(title="Resume API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

@app.post("/resume")
async def create_resume(
    name: str = Form(...),
    age: str = Form(...),
    region: str = Form(...),
    image: Optional[UploadFile] = File(None)
):
    try:
        # 이미지 처리
        image_data = None
        image_info = ""
        if image:
            contents = await image.read()
            image_data = base64.b64encode(contents).decode('utf-8')
            image_info = f"\n첨부된 증명사진이 있습니다."

        # OpenAI API 호출
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{
                "role": "user",
                "content": f"""다음은 구직자의 기본 정보입니다:
                - 이름: {name}
                - 나이: {age}
                - 지역: {region}{image_info}
                위 정보를 바탕으로 다음 사항을 포함한 노인 구직자를 위한 이력서를 작성해주세요:
                1. 자기소개
                2. 강점
                3. 구직 희망 직종
                4. 근무 가능 시간
                5. 특이사항

                이력서는 따뜻하고 진정성 있는 톤으로 작성해주시되, 고용주의 입장에서 매력적으로 느낄 수 있는 내용으로 구성해주세요."""
            }],
            temperature=0.7,
            max_tokens=2000
        )

        return JSONResponse({
            "success": True,
            "resume": response.choices[0].message.content,
            "image": image_data
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="서버 처리 중 오류가 발생했습니다.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
