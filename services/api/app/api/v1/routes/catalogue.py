from fastapi import APIRouter, Query

from app.api.deps import DbSession
from app.repositories.catalogue import CatalogueRepository
from app.schemas.catalogue import CareerOut, InterestOut, ProviderOut, QualificationOut, SubjectOut
from app.services.catalogue_mapper import career_out, provider_out, qualification_out, source_out


router = APIRouter()


@router.get("/subjects", response_model=list[SubjectOut])
async def subjects(session: DbSession) -> list[SubjectOut]:
    records = await CatalogueRepository(session).subjects()
    return [
        SubjectOut(
            id=x.id,
            code=x.code,
            name=x.name,
            source=source_out(x.content_version) if x.content_version else None,
        )
        for x in records
    ]


@router.get("/interests", response_model=list[InterestOut])
async def interests(session: DbSession) -> list[InterestOut]:
    records = await CatalogueRepository(session).interests()
    return [
        InterestOut(
            id=x.id,
            code=x.code,
            name=x.name,
            source=source_out(x.content_version) if x.content_version else None,
        )
        for x in records
    ]


@router.get("/careers", response_model=list[CareerOut])
async def careers(
    session: DbSession,
    query: str | None = Query(default=None, max_length=80),
) -> list[CareerOut]:
    records = await CatalogueRepository(session).careers(query)
    return [career_out(record) for record in records]


@router.get("/qualifications", response_model=list[QualificationOut])
async def qualifications(
    session: DbSession,
    query: str | None = Query(default=None, max_length=80),
) -> list[QualificationOut]:
    records = await CatalogueRepository(session).qualifications(query)
    return [qualification_out(record) for record in records]


@router.get("/providers", response_model=list[ProviderOut])
async def providers(
    session: DbSession,
    query: str | None = Query(default=None, max_length=80),
) -> list[ProviderOut]:
    records = await CatalogueRepository(session).providers(query)
    return [provider_out(record) for record in records]
