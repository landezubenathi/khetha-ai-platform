from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import Career, Interest, Provider, Qualification, Subject


class CatalogueRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def subjects(self) -> list[Subject]:
        result = await self.session.scalars(
            select(Subject).where(Subject.active.is_(True)).order_by(Subject.name)
        )
        return list(result)

    async def interests(self) -> list[Interest]:
        result = await self.session.scalars(
            select(Interest).where(Interest.active.is_(True)).order_by(Interest.name)
        )
        return list(result)

    async def careers(self, query: str | None = None) -> list[Career]:
        statement: Select[tuple[Career]] = select(Career).where(Career.active.is_(True))
        if query:
            statement = statement.where(func.lower(Career.name).contains(query.casefold().strip()))
        result = await self.session.scalars(statement.order_by(Career.name))
        return list(result.unique())

    async def qualifications(self, query: str | None = None) -> list[Qualification]:
        statement: Select[tuple[Qualification]] = select(Qualification).where(
            Qualification.active.is_(True)
        )
        if query:
            statement = statement.where(
                func.lower(Qualification.title).contains(query.casefold().strip())
            )
        result = await self.session.scalars(statement.order_by(Qualification.title))
        return list(result)

    async def providers(self, query: str | None = None) -> list[Provider]:
        statement: Select[tuple[Provider]] = select(Provider).where(Provider.active.is_(True))
        if query:
            statement = statement.where(func.lower(Provider.name).contains(query.casefold().strip()))
        result = await self.session.scalars(statement.order_by(Provider.name))
        return list(result)

