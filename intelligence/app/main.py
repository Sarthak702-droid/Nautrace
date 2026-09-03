from __future__ import annotations

import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.config import load_algorithm_config
from app.models import AnalysisRequest, AnalysisResponse
from app.services.analysis import ANALYSIS_VERSION, AnalysisService

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("nautrace.intelligence")

loaded_config = load_algorithm_config()
service = AnalysisService(loaded_config)

app = FastAPI(
    title="NAUTRACE Intelligence Service",
    version=ANALYSIS_VERSION,
    description=(
        "Research-grade backend engine for uncertainty-aware oil-spill hindcasting, "
        "AIS trajectory reconstruction, and explainable vessel attribution."
    ),
)


@app.exception_handler(RuntimeError)
async def runtime_error_handler(_: Request, exc: RuntimeError) -> JSONResponse:
    logger.exception("analysis_runtime_error", exc_info=exc)
    return JSONResponse(status_code=422, content={"error": "analysis_failed", "message": str(exc)})


@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "nautrace-intelligence",
        "analysis_version": ANALYSIS_VERSION,
        "algorithm_config_version": loaded_config.config.version,
        "algorithm_config_sha256": loaded_config.sha256,
    }


@app.get("/readyz")
def readyz() -> dict[str, str]:
    if not loaded_config.sha256:
        raise HTTPException(status_code=503, detail="algorithm configuration unavailable")
    return {"status": "ready"}


@app.post("/internal/v1/analyze", response_model=AnalysisResponse)
def analyze(request: AnalysisRequest) -> AnalysisResponse:
    return service.analyze(request)
