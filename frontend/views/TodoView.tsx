import { EndpointValidationError } from '@hilla/frontend';
import { Button } from '@hilla/react-components/Button.js';
import { Checkbox } from '@hilla/react-components/Checkbox.js';
import { TextField } from '@hilla/react-components/TextField.js';
import { FormikErrors, useFormik } from 'formik';
import Todo from 'Frontend/generated/com/example/application/Todo';
import { TodoEndpoint } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';

export default function TodoView() {
  const empty: Todo = { task: '', done: false };
  const [todos, setTodos] = useState(Array<Todo>());

  useEffect(() => {
    (async () => {
      setTodos(await TodoEndpoint.findAll());
    })();

    return () => {};
  }, []);

  const createForm = useFormik({
    initialValues: empty,
    onSubmit: async (value: Todo, { setSubmitting, setErrors }) => {
      try {
        const saved = (await TodoEndpoint.save(value)) ?? value;
        setTodos([...todos, saved]);
        createForm.resetForm();
      } catch (e: unknown) {
        if (e instanceof EndpointValidationError) {
          const errors: FormikErrors<Todo> = {};
          for (const error of e.validationErrorData) {
            if (typeof error.parameterName === 'string' && error.parameterName in empty) {
              const key = error.parameterName as string & keyof Todo;
              errors[key] = error.message;
            }
          }
          setErrors(errors);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  async function changeStatus(todo: Todo, done: Todo['done']) {
    const newTodo = { ...todo, done: done };
    const saved = (await TodoEndpoint.save(newTodo)) ?? newTodo;
    setTodos(todos.map((item) => (item.id === todo.id ? saved : item)));
  }

  async function updateTask(todo: Todo, task: Todo['task']) {
    if (todo.task == task) return;

    const newTodo = { ...todo, task };
    const saved = (await TodoEndpoint.save(newTodo)) ?? newTodo;
    setTodos(todos.map((item) => (item.id === todo.id ? saved : item)));
  }

  async function deleteTodo(todo: Todo) {
    const deletedTodoId = await TodoEndpoint.delete(todo);
    if (deletedTodoId) {
      setTodos(todos.filter((t) => t.id != deletedTodoId));
    }
  }

  return (
    <>
      <div className="m-m flex items-baseline gap-m">
        <TextField
          name="task"
          label="Task"
          value={createForm.values.task}
          onChange={createForm.handleChange}
          onBlur={createForm.handleChange}
        />
        <Button theme="primary" disabled={createForm.isSubmitting} onClick={createForm.submitForm}>
          Add
        </Button>
      </div>

      <div className="m-m flex flex-col items-stretch gap-s">
        {todos.map((todo) => (
          <div key={todo.id}>
            <Checkbox
              name="done"
              checked={todo.done}
              onCheckedChanged={({ detail: { value } }) => changeStatus(todo, value)}
            />
            <TextField
              name="task"
              value={todo.task}
              onBlur={(e: any) => updateTask(todo, e.target.value)}
            />
            <Button onClick={() => deleteTodo(todo)}>X</Button>
          </div>
        ))}
      </div>
    </>
  );
}
