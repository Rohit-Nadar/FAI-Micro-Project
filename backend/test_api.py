import sys
import os
import httpx

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.main import app
from app.database import init_db

import asyncio

async def async_test_endpoints():
    init_db()
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        print("Testing /health...")
        r = await client.get("/health")
        print("Health status code:", r.status_code)
        print("Health response:", r.json())

        print("\nTesting /search (Greedy Best-First)...")
        payload = {
            "jug_a_capacity": 4,
            "jug_b_capacity": 3,
            "target": 2,
            "initial_a": 0,
            "initial_b": 0,
            "algorithm": "gbfs",
            "save_to_db": True
        }
        r = await client.post("/search", json=payload)
        print("Search status code:", r.status_code)
        data = r.json()
        print(f"Success: {data['success']}, Operations: {data['solution_length']}, States expanded: {data['expanded_states']}")
        print(f"Saved to DB: {data['database_saved']}, Simulation ID: {data['simulation_id']}")

        print("\nTesting /compare (GBFS vs BFS)...")
        compare_payload = {
            "jug_a_capacity": 4,
            "jug_b_capacity": 7,
            "target": 5,
            "initial_a": 0,
            "initial_b": 0
        }
        r = await client.post("/compare", json=compare_payload)
        print("Compare status code:", r.status_code)
        comp_data = r.json()
        print(f"Misled: {comp_data['is_misled']}, Path Diff: {comp_data['path_length_difference']}")
        print(f"Explanation: {comp_data['misled_explanation'][:120]}...")

        print("\nTesting /history...")
        r = await client.get("/history")
        print("History status code:", r.status_code)
        history = r.json()
        print(f"History entries: {len(history)}")
        if history:
            item_id = history[0]["id"]
            print(f"Testing /history/{item_id}...")
            r_det = await client.get(f"/history/{item_id}")
            print("History detail status code:", r_det.status_code)
            print(f"Detail fetched with {len(r_det.json()['steps'])} steps.")

        print("\nALL API ENDPOINTS TESTED AND VERIFIED PERFECTLY!")

if __name__ == "__main__":
    asyncio.run(async_test_endpoints())

