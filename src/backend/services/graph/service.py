from typing import Dict, List, Optional, AsyncGenerator
from neo4j import AsyncGraphDatabase, AsyncSession
from neo4j.exceptions import Neo4jError
from langchain_neo4j import Neo4jGraph
from contextlib import asynccontextmanager

class GraphService:
    def __init__(self, uri: str, username: str, password: str):
        # Async driver for operations
        self.driver = AsyncGraphDatabase.driver(
            uri, 
            auth=(username, password),
            max_connection_lifetime=3600
        )
        # LangChain graph for semantic operations
        self.graph = Neo4jGraph(
            url=uri,
            username=username,
            password=password
        )

    async def close(self):
        await self.driver.close()

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        session = self.driver.session()
        try:
            yield session
        finally:
            await session.close()

    async def store_requirement(self, req: Dict) -> str:
      async with self.get_session() as session:
        try:
          result = await session.run(
            """
            MERGE (r:Requirement {id: $id})
            SET r += $properties
            WITH r
            OPTIONAL MATCH (r)-[rel:RELATED_TO]->()
            RETURN r.id as id, collect(type(rel)) as relationships
            """,
            id=req["id"],
            properties=req
          )
          record = await result.single()
          return {
            "id": record["id"],
            "relationships": record["relationships"]
          }
        except Neo4jError as e:
          raise Exception(f"Failed to store requirement: {str(e)}")

    async def store_process(self, process: Dict) -> str:
        async with self.get_session() as session:
            try:
                result = await session.run(
                    """
                    MERGE (p:Process {id: $id})
                    SET p += $properties
                    WITH p
                    MATCH (r:Requirement {id: $req_id})
                    MERGE (p)-[:IMPLEMENTS]->(r)
                    RETURN p.id
                    """,
                    id=process["id"],
                    properties=process,
                    req_id=process.get("requirement_id")
                )
                return await result.single()["p.id"]
            except Neo4jError as e:
                raise Exception(f"Failed to store process: {str(e)}")

    async def get_context(self, conversation_id: str) -> Dict:
        async with self.get_session() as session:
            try:
                result = await session.run(
                    """
                    MATCH (r:Requirement)
                    WHERE r.conversation_id = $conv_id
                    OPTIONAL MATCH (p:Process)-[:IMPLEMENTS]->(r)
                    RETURN collect(distinct r) as requirements,
                           collect(distinct p) as processes
                    """,
                    conv_id=conversation_id
                )
                record = await result.single()
                return {
                    "requirements": record["requirements"],
                    "processes": record["processes"]
                }
            except Neo4jError as e:
                raise Exception(f"Failed to get context: {str(e)}")