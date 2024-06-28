import { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const client = generateClient<Schema>();

function App() {
    const [newTodoContent, setNewTodoContent] = useState("");
    const queryClient = useQueryClient();

    const { data: todos, isLoading, isError } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const response = await client.models.Todo.list();
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (content: string) => {
            const { data: newTodo } = await client.models.Todo.create({ content });
            return newTodo;
        },
        onMutate: async (newContent) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueryData<Schema["Todo"]["type"][]>(["todos"]);
            if (previousTodos) {
                queryClient.setQueryData<Schema["Todo"]["type"][]>(["todos"], [
                    ...previousTodos,
                    { id: Date.now().toString(), content: newContent } as Schema["Todo"]["type"],
                ]);
            }
            return { previousTodos };
        },
        onError: (_err, _newTodo, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["todos"], context.previousTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { data: deletedTodo } = await client.models.Todo.delete({ id });
            return deletedTodo;
        },
        onMutate: async (deletedId) => {
            await queryClient.cancelQueries({ queryKey: ["todos"] });
            const previousTodos = queryClient.getQueryData<Schema["Todo"]["type"][]>(["todos"]);
            if (previousTodos) {
                queryClient.setQueryData<Schema["Todo"]["type"][]>(
                    ["todos"],
                    previousTodos.filter((todo) => todo.id !== deletedId)
                );
            }
            return { previousTodos };
        },
        onError: (_err, _deletedId, context) => {
            if (context?.previousTodos) {
                queryClient.setQueryData(["todos"], context.previousTodos);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    function createTodo() {
        if (newTodoContent.trim()) {
            createMutation.mutate(newTodoContent);
            setNewTodoContent("");
        }
    }

    function deleteTodo(id: string) {
        deleteMutation.mutate(id);
    }

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching todos</div>;

    return (
        <main>
            <h1>My todos</h1>
            <input
                type="text"
                value={newTodoContent}
                onChange={(e) => setNewTodoContent(e.target.value)}
                placeholder="Enter new todo"
            />
            <button onClick={createTodo}>+ new</button>
            <ul>
                {todos?.map((todo) => (
                    <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
                        {todo.content}
                    </li>
                ))}
            </ul>
            <div>
                🥳 App successfully hosted with optimistic UI. Try creating or deleting a todo.
                <br />
                <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
                    Review next step of this tutorial.
                </a>
            </div>
        </main>
    );
}

export default App;