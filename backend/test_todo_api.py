import asyncio
import aiohttp
import json

API_BASE = "http://localhost:8001"  # Backend is running on port 8001
API = f"{API_BASE}/api"

async def test_todo_api():
    """Test the todo API endpoints"""
    async with aiohttp.ClientSession() as session:
        print("🧪 Testing Todo API endpoints...")
        
        # Test 1: Create a todo
        print("\n1. Creating a new todo...")
        todo_data = {
            "title": "Test Todo",
            "description": "This is a test todo item"
        }
        
        async with session.post(f"{API}/todos", json=todo_data) as resp:
            if resp.status == 200:
                created_todo = await resp.json()
                print(f"✅ Todo created successfully: {created_todo['title']}")
                todo_id = created_todo['id']
            else:
                print(f"❌ Failed to create todo: {resp.status}")
                return
        
        # Test 2: Get all todos
        print("\n2. Fetching all todos...")
        async with session.get(f"{API}/todos") as resp:
            if resp.status == 200:
                todos = await resp.json()
                print(f"✅ Retrieved {len(todos)} todos")
                for todo in todos:
                    print(f"  - {todo['title']} (Completed: {todo['completed']})")
            else:
                print(f"❌ Failed to fetch todos: {resp.status}")
        
        # Test 3: Update the todo
        print("\n3. Updating the todo...")
        update_data = {
            "title": "Updated Test Todo",
            "description": "This todo has been updated",
            "completed": True
        }
        
        async with session.put(f"{API}/todos/{todo_id}", json=update_data) as resp:
            if resp.status == 200:
                updated_todo = await resp.json()
                print(f"✅ Todo updated successfully: {updated_todo['title']} (Completed: {updated_todo['completed']})")
            else:
                print(f"❌ Failed to update todo: {resp.status}")
        
        # Test 4: Get specific todo
        print("\n4. Fetching specific todo...")
        async with session.get(f"{API}/todos/{todo_id}") as resp:
            if resp.status == 200:
                todo = await resp.json()
                print(f"✅ Retrieved todo: {todo['title']}")
            else:
                print(f"❌ Failed to fetch specific todo: {resp.status}")
        
        # Test 5: Create another todo
        print("\n5. Creating another todo...")
        todo_data2 = {
            "title": "Second Test Todo",
            "description": "Another test item"
        }
        
        async with session.post(f"{API}/todos", json=todo_data2) as resp:
            if resp.status == 200:
                created_todo2 = await resp.json()
                print(f"✅ Second todo created: {created_todo2['title']}")
                todo_id2 = created_todo2['id']
            else:
                print(f"❌ Failed to create second todo: {resp.status}")
                return
        
        # Test 6: Get all todos again to see both
        print("\n6. Fetching all todos again...")
        async with session.get(f"{API}/todos") as resp:
            if resp.status == 200:
                todos = await resp.json()
                print(f"✅ Retrieved {len(todos)} todos")
                for todo in todos:
                    status = "✓" if todo['completed'] else "○"
                    print(f"  {status} {todo['title']}")
            else:
                print(f"❌ Failed to fetch todos: {resp.status}")
        
        # Test 7: Delete the first todo
        print(f"\n7. Deleting todo {todo_id}...")
        async with session.delete(f"{API}/todos/{todo_id}") as resp:
            if resp.status == 200:
                result = await resp.json()
                print(f"✅ Todo deleted successfully: {result['message']}")
            else:
                print(f"❌ Failed to delete todo: {resp.status}")
        
        # Test 8: Verify deletion
        print("\n8. Verifying deletion...")
        async with session.get(f"{API}/todos") as resp:
            if resp.status == 200:
                todos = await resp.json()
                print(f"✅ Now have {len(todos)} todos remaining")
                for todo in todos:
                    status = "✓" if todo['completed'] else "○"
                    print(f"  {status} {todo['title']}")
            else:
                print(f"❌ Failed to fetch todos: {resp.status}")
        
        print("\n🎉 Todo API testing completed!")

if __name__ == "__main__":
    asyncio.run(test_todo_api())