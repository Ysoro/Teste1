from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
import base64
from datetime import datetime
import uvicorn

app = FastAPI(title="Iridology Analysis API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserProfile(BaseModel):
    id: Optional[str] = None
    sex: str  # 'M' or 'F'
    birth_date: str  # YYYY-MM-DD
    birth_time: str  # HH:MM
    birth_location: str  # City, Country
    created_at: Optional[datetime] = None

class EyeAnalysis(BaseModel):
    id: Optional[str] = None
    user_id: str
    eye_image_base64: str
    analysis_results: Optional[dict] = None
    created_at: Optional[datetime] = None

class IridologyReport(BaseModel):
    id: Optional[str] = None
    user_id: str
    analysis_id: str
    iridology_analysis: dict
    astrology_analysis: dict
    combined_insights: str
    created_at: Optional[datetime] = None

# In-memory storage for MVP (will be replaced with MongoDB)
users_db = {}
analyses_db = {}
reports_db = {}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Iridology Analysis API is running"}

@app.post("/api/users")
async def create_user_profile(profile: UserProfile):
    """Create a new user profile with birth information"""
    try:
        user_id = str(uuid.uuid4())
        profile.id = user_id
        profile.created_at = datetime.now()
        
        users_db[user_id] = profile.dict()
        
        return {
            "success": True,
            "user_id": user_id,
            "message": "User profile created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile by ID"""
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    
    return users_db[user_id]

@app.post("/api/upload-eye-image")
async def upload_eye_image(
    user_id: str = Form(...),
    eye_image: UploadFile = File(...)
):
    """Upload and process eye image for iridology analysis"""
    try:
        # Validate user exists
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Read and encode image
        image_data = await eye_image.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Create analysis record
        analysis_id = str(uuid.uuid4())
        analysis = EyeAnalysis(
            id=analysis_id,
            user_id=user_id,
            eye_image_base64=image_base64,
            created_at=datetime.now()
        )
        
        analyses_db[analysis_id] = analysis.dict()
        
        return {
            "success": True,
            "analysis_id": analysis_id,
            "message": "Eye image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-iridology/{analysis_id}")
async def analyze_iridology(analysis_id: str):
    """Perform iridology analysis on uploaded eye image"""
    try:
        if analysis_id not in analyses_db:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        analysis = analyses_db[analysis_id]
        
        # Mock iridology analysis (to be replaced with actual AI service)
        mock_analysis = {
            "iris_constitution": "Mixed constitution with lymphatic tendencies",
            "constitutional_weakness": ["Digestive system", "Lymphatic system"],
            "organ_zones": {
                "stomach": "Slight irritation indicated",
                "liver": "Good vitality",
                "kidneys": "Minor stress indicators",
                "lungs": "Clear, good function"
            },
            "iris_markings": [
                "Nerve rings visible - indicating stress patterns",
                "Lacunae in digestive zone - digestive sensitivity"
            ],
            "recommendations": [
                "Focus on digestive health",
                "Stress management techniques",
                "Regular detoxification support"
            ]
        }
        
        # Update analysis with results
        analysis['analysis_results'] = mock_analysis
        analyses_db[analysis_id] = analysis
        
        return {
            "success": True,
            "analysis_results": mock_analysis,
            "message": "Iridology analysis completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-astrology/{user_id}")
async def generate_astrology_analysis(user_id: str):
    """Generate astrological analysis based on birth data"""
    try:
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        
        user = users_db[user_id]
        
        # Mock astrology analysis (to be replaced with actual astrology service)
        mock_astrology = {
            "sun_sign": "Virgo",
            "moon_sign": "Cancer", 
            "rising_sign": "Scorpio",
            "planetary_positions": {
                "mercury": "Libra",
                "venus": "Leo",
                "mars": "Gemini"
            },
            "health_aspects": [
                "Strong emphasis on digestive health due to Virgo sun",
                "Emotional eating patterns indicated by Cancer moon",
                "Natural healing abilities from Scorpio rising"
            ],
            "constitution_analysis": "Earth-Water dominant constitution indicating strong digestive focus and emotional sensitivity",
            "health_recommendations": [
                "Pay attention to digestive health",
                "Emotional balance crucial for physical wellbeing",
                "Natural remedies and holistic approaches favored"
            ]
        }
        
        return {
            "success": True,
            "astrology_analysis": mock_astrology,
            "message": "Astrological analysis completed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-report")
async def generate_combined_report(
    user_id: str = Form(...),
    analysis_id: str = Form(...)
):
    """Generate combined iridology and astrology report"""
    try:
        # Validate inputs
        if user_id not in users_db:
            raise HTTPException(status_code=404, detail="User not found")
        if analysis_id not in analyses_db:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        user = users_db[user_id]
        analysis = analyses_db[analysis_id]
        
        if not analysis.get('analysis_results'):
            raise HTTPException(status_code=400, detail="Iridology analysis not completed")
        
        # Get astrology analysis (generate if not exists)
        astrology_response = await generate_astrology_analysis(user_id)
        astrology_analysis = astrology_response['astrology_analysis']
        
        # Generate combined insights
        combined_insights = f"""
## Comprehensive Health Analysis Report

### Personal Profile
- Sex: {user['sex']}
- Birth Date: {user['birth_date']}
- Birth Time: {user['birth_time']}
- Birth Location: {user['birth_location']}

### Iridology Analysis Summary
{analysis['analysis_results']['iris_constitution']}

**Key Findings:**
- Constitutional weaknesses: {', '.join(analysis['analysis_results']['constitutional_weakness'])}
- Primary recommendations: {', '.join(analysis['analysis_results']['recommendations'])}

### Astrological Health Insights
**Astrological Constitution:** {astrology_analysis['constitution_analysis']}

**Planetary Health Influences:**
- Sun Sign ({astrology_analysis['sun_sign']}): {astrology_analysis['health_aspects'][0]}
- Moon Sign ({astrology_analysis['moon_sign']}): {astrology_analysis['health_aspects'][1]}
- Rising Sign ({astrology_analysis['rising_sign']}): {astrology_analysis['health_aspects'][2]}

### Integrated Health Recommendations
1. **Digestive Health Priority**: Both iridology and astrology indicate strong focus needed on digestive system
2. **Emotional-Physical Connection**: Emotional balance directly impacts physical health
3. **Natural Healing Approach**: Constitutional makeup favors holistic and natural remedies
4. **Stress Management**: Both analyses show importance of managing stress for optimal health

### Personalized Action Plan
- Implement digestive support protocols
- Practice emotional regulation techniques
- Consider natural/herbal remedies
- Regular stress assessment and management
- Follow-up iridology analysis in 6 months
        """
        
        # Create report record
        report_id = str(uuid.uuid4())
        report = IridologyReport(
            id=report_id,
            user_id=user_id,
            analysis_id=analysis_id,
            iridology_analysis=analysis['analysis_results'],
            astrology_analysis=astrology_analysis,
            combined_insights=combined_insights,
            created_at=datetime.now()
        )
        
        reports_db[report_id] = report.dict()
        
        return {
            "success": True,
            "report_id": report_id,
            "report": report.dict(),
            "message": "Combined report generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reports/{report_id}")
async def get_report(report_id: str):
    """Get report by ID"""
    if report_id not in reports_db:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return reports_db[report_id]

@app.get("/api/reports/user/{user_id}")
async def get_user_reports(user_id: str):
    """Get all reports for a user"""
    user_reports = [report for report in reports_db.values() if report['user_id'] == user_id]
    return {"reports": user_reports}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)