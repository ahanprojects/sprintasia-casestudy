import {
  FaRegCheckSquare,
  FaTasks,
  FaArchive,
  FaCaretDown,
} from "react-icons/fa";
import { VscTextSize } from "react-icons/vsc";
import {
  MdDateRange,
  MdEdit,
  MdDelete,
  MdAdsClick,
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import { TbProgressCheck } from "react-icons/tb";
import { FaFileCirclePlus } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import { Task } from "../types/types";
import { APIURL } from "../config/config";
import { z } from "zod";

export default function TaskPage() {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [tab, setTab] = useState<"active" | "completed">("active");
  const [expand, setExpand] = useState<Record<number, boolean>>({});

  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogTrigger = useRef<"new" | "edit" | "newsubtask" | null>(null);

  // Form States
  const taskId = useRef<number | null>(null);
  const [formTitle, setFormTitle] = useState("New Task");
  const [formError, setFormError] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [dateValue, setDateValue] = useState("");

  async function doFetch(url: string, method = "GET", body?: any) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : null,
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      await fetchData(); // Refresh
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    setError(null);

    try {
      const isCompleted = tab == "completed";
      const response = await fetch(`${APIURL}/tasks?completed=${isCompleted}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result: Task[] = await response.json();
      setData(result);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [tab]);

  function closeModal() {
    taskId.current = null;
    dialogTrigger.current = null;
    setNameValue("");
    setDateValue("");
    setFormError(null)
    dialogRef.current?.close();
  }

  function handleComplete(id: number, previous: boolean) {
    doFetch(`${APIURL}/tasks/${id}`, "PATCH", { completed: !previous });
  }

  function handleCreate() {
    taskId.current = null;
    dialogTrigger.current = "new";
    setFormTitle("New Task");
    setNameValue("");
    setDateValue("");
    dialogRef.current?.showModal();
  }

  function handleNewSubtask(parentId: number) {
    taskId.current = parentId;
    dialogTrigger.current = "newsubtask";
    setFormTitle("New Subtask");
    setNameValue("");
    setDateValue("");
    dialogRef.current?.showModal();
  }

  function handleEdit(id: number, name: string, date: string) {
    taskId.current = id;
    dialogTrigger.current = "edit";
    setFormTitle("Edit Task");
    setNameValue(name);
    const formattedDate = new Date(date).toISOString().slice(0, 16); // "2023-12-02T10:00"
    setDateValue(formattedDate);
    dialogRef.current?.showModal();
  }

  function saveTask() {
    const method = dialogTrigger.current == "edit" ? "PATCH" : "POST";
    const url =
      dialogTrigger.current == "edit"
        ? `${APIURL}/tasks/${taskId.current}`
        : `${APIURL}/tasks`;

    let data = {
      name: nameValue,
      due: new Date(dateValue),
      parent_id: dialogTrigger.current == "newsubtask" ? taskId.current : null,
    };

    // Validate
    const schema = z.object({
      name: z.string().min(1),
      due: z.date(),
      parent_id: z.number().int().optional().nullable()
    })

    const validation = schema.safeParse(data)
    if (!validation.success) {
      setFormError("Data is not valid")
      return
    }

    doFetch(url, method, data);
    closeModal();
  }

  function handleDelete(id: number) {
    doFetch(`${APIURL}/tasks/${id}`, "DELETE");
  }

  function handleExpand(id: number) {
    setExpand((prev) => ({ ...prev, [id]: id in prev ? !prev[id] : true }));
  }

  return (
    <>
      <dialog className="bg-white shadow-lg rounded-lg" ref={dialogRef}>
        <TaskForm
          title={formTitle}
          error={formError}
          onCancel={closeModal}
          onSave={saveTask}
          nameValue={nameValue}
          onNameChange={(e) => {
            setNameValue(e.target.value);
          }}
          dateValue={dateValue}
          onDateChange={(e) => {
            setDateValue(e.target.value);
          }}
        />
      </dialog>
      <main className="min-h-screen max-w-5xl mx-auto py-12 px-8">
        <div className="flex gap-4 items-center pb-8">
          <FaRegCheckSquare className="text-gray-500" size={30} />
          <h1 className="text-4xl font-bold">Tasks</h1>
        </div>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setTab("active")}
            className={`${
              tab == "active" ? "border-b-2 text-black" : "text-gray-500"
            } border-black flex gap-2 items-center px-4 py-2 font-medium `}>
            <FaTasks />
            <p>Active</p>
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`${
              tab == "completed" ? "border-b-2 text-black" : "text-gray-500"
            } border-black flex gap-2 items-center px-4 py-2 font-medium `}>
            <FaArchive />
            <p>Completed</p>
          </button>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <table className="w-full border-collapse text-left font-normal!">
            <thead>
              <tr>
                <th className="p-2 font-normal border-l-0 border text-left border-gray-300 text-gray-400">
                  <FaRegCheckSquare size={20} />
                </th>
                <th className="p-2 font-normal border text-left border-gray-300 text-gray-400">
                  <span className="flex gap-1 items-center">
                    <VscTextSize size={20} />
                    <span>Task Name</span>
                  </span>
                </th>
                <th className="p-2 font-normal border text-left border-gray-300 text-gray-400">
                  <span className="flex gap-1 items-center">
                    <MdDateRange size={20} />
                    <span>Due</span>
                  </span>
                </th>
                <th className="p-2 font-normal border-r-0 border text-left border-gray-300 text-gray-400">
                  <span className="flex gap-1 items-center">
                    <TbProgressCheck size={20} />
                    <span>Progress</span>
                  </span>
                </th>
                <th className="p-2 font-normal border-r-0 border text-left border-gray-300 text-gray-400">
                  <span className="flex gap-1 items-center">
                    <MdAdsClick size={20} />
                    <span>Actions</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((t: Task) => (
                <>
                  <Row
                    data={t}
                    onDelete={() => handleDelete(t.id)}
                    onEdit={() => handleEdit(t.id, t.name, t.due)}
                    onComplete={() => handleComplete(t.id, t.completed)}
                    onExpand={() => handleExpand(t.id)}
                    onNewSubtask={() => handleNewSubtask(t.id)}
                    key={t.id}
                  />
                  {t.subtasks?.length > 0 &&
                    expand[t.id] &&
                    t.subtasks.map((st) => (
                      <Row
                        data={st}
                        onDelete={() => handleDelete(st.id)}
                        onEdit={() => handleEdit(st.id, st.name, st.due)}
                        onComplete={() => handleComplete(st.id, st.completed)}
                        key={st.id}
                        isSubtask
                      />
                    ))}
                </>
              ))}
            </tbody>
          </table>
        )}
        {tab == "active" && (
          <button
            className="w-full p-2 flex gap-2 items-center text-gray-500 border-y border-gray-300 hover:bg-gray-200"
            onClick={handleCreate}>
            <GoPlus />
            <span>New Task</span>
          </button>
        )}
      </main>
    </>
  );
}

function Row({
  data,
  onNewSubtask,
  onEdit,
  onDelete,
  onComplete,
  onExpand,
  isSubtask,
}: {
  data: Task;
  onNewSubtask?: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onExpand?: () => void;
  isSubtask?: boolean;
}) {
  const { name, due, subtasks, completed } = data;
  let progress = "0%";
  const hasSubtasks = (subtasks?.length ?? 0) > 0;
  if (hasSubtasks) {
    progress =
      (
        (subtasks?.reduce((prev, curr) => prev + (curr.completed ? 1 : 0), 0) /
          subtasks.length) *
        100
      ).toString() + "%";
  }

  let date = new Date(due);
  let isDue = date < new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZone: "UTC",
  });

  return (
    <tr>
      <td className="p-2 border-l-0 border border-gray-300">
        <input
          id="default-checkbox"
          type="checkbox"
          defaultChecked={completed}
          onClick={onComplete}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </td>
      <td className="p-2 border border-gray-300">
        <div className="flex gap-1.5 items-center">
          {isSubtask && (
            <MdOutlineSubdirectoryArrowRight className="ml-2 text-gray-600" />
          )}
          {hasSubtasks && (
            <button
              className="p-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded h-fit"
              onClick={onExpand}>
              <FaCaretDown size={14} />
            </button>
          )}
          <p className="inline flex-1">{name}</p>
        </div>
      </td>
      <td
        className={`p-2 border border-gray-300 ${
          isDue ? "text-red-600" : "text-blue-600"
        }`}>
        {formattedDate}
      </td>
      <td className="p-2 border border-gray-300 text-center">
        {!isSubtask && hasSubtasks && (
          <div className="flex gap-1 items-center">
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: progress }}></div>
            </div>
            <p className="text-xs font-medium">{progress}</p>
          </div>
        )}
      </td>
      <td className="p-2  border-r-0  border border-gray-300 space-x-1 text-center">
        {!isSubtask && (
          <button
            title="New Subtask"
            className="text-blue-600 bg-blue-100 p-1 rounded aspect-square"
            onClick={onNewSubtask}>
            <FaFileCirclePlus />
          </button>
        )}
        <button
          title="Edit task"
          className="text-orange-600 bg-orange-100 p-1 rounded aspect-square"
          onClick={onEdit}>
          <MdEdit />
        </button>
        <button
          title="Delete task"
          className="text-red-600 bg-red-100 p-1 rounded aspect-square"
          onClick={onDelete}>
          <MdDelete />
        </button>
      </td>
    </tr>
  );
}

function TaskForm({
  title,
  nameValue,
  onNameChange,
  dateValue,
  onDateChange,
  onCancel,
  onSave,
  error,
}: {
  title: string;
  nameValue: string;
  onNameChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  dateValue: string;
  onDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSave: () => void;
  error: string | null
}) {
  return (
    <div className="m-8 space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <textarea
        value={nameValue}
        name="name"
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        placeholder="Describe your task"
        onChange={onNameChange}
      />
      <input
        value={dateValue}
        name="date"
        type="datetime-local"
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        placeholder="Describe your task"
        onChange={onDateChange}
      />
      { error && <p className="text-red-600 font-medium p-2 text-center">{error}</p> }
      <div className="flex gap-1 justify-end pt-4">
        <button
          onClick={onCancel}
          className="px-4 py-1 hover:bg-gray-200 rounded-md">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-1 rounded-md">
          Save
        </button>
      </div>
    </div>
  );
}
