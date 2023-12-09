import "./App.css";
import {
  FaRegCheckSquare,
  FaTasks,
  FaArchive,
  FaCaretDown,
} from "react-icons/fa";
import { VscTextSize } from "react-icons/vsc";
import { MdDateRange } from "react-icons/md";
import { TbProgressCheck } from "react-icons/tb";
import { MdAdsClick } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useRef, useState } from "react";

/**
 * Required Features:
 *  - Add task
 *  - Show on-going tasks
 *  - Delete task
 *  - Edit task
 *  - Check to complete task, remove from ongoing
 *  - Show completed/history task
 *
 * Additional features
 *  - Deadline (date and time) for each task
 *  - Indicator if task is due (red and blue aja)
 *  - Subtask
 *    - Add, edit, delete, check a subtask
 *    - If all task checked, show completed status
 *    - Progress status bar
 *
 * Fields: checkbox, Task Name, Due, Progress, action
 *
 */
type Task = {
  id: number;
  status: boolean;
  name: string;
  due: string;
};

function App() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<'active' | 'completed'>('active') 

  function closeModal() {
    dialogRef.current?.close();
  }

  function saveTask() {}

  function handleComplete(id: string) {}

  function handleCreate() {
    dialogRef.current?.showModal();
  }

  function handleEdit(id: string) {
    dialogRef.current?.showModal();
  }

  function handleDelete(id: string) {}

  return (
    <>
      <dialog className="bg-white shadow-lg rounded-lg" ref={dialogRef}>
        <TaskForm onCancel={closeModal} onSave={saveTask} />
      </dialog>
      <main className="min-h-screen max-w-5xl mx-auto py-8">
        <div className="flex gap-4 items-center pb-8">
          <FaRegCheckSquare className="text-gray-500" size={30} />
          <h1 className="text-4xl font-bold">Tasks</h1>
        </div>
        <div className="flex gap-1 items-center">
          <button className="flex gap-2 items-center px-4 py-2 font-medium border-b-2 border-black">
            <FaTasks />
            <p>Active</p>
          </button>
          <button className="flex gap-2 items-center px-2 py-2 font-medium text-gray-500">
            <FaArchive />
            <p>Completed</p>
          </button>
        </div>
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
            <Row
              onDelete={() => handleDelete("")}
              onEdit={() => handleEdit("")}
              onComplete={() => handleComplete("")}
            />
            <Row
              onDelete={() => handleDelete("")}
              onEdit={() => handleEdit("")}
              onComplete={() => handleComplete("")}
            />
            <Row
              onDelete={() => handleDelete("")}
              onEdit={() => handleEdit("")}
              onComplete={() => handleComplete("")}
            />
            <Row
              onDelete={() => handleDelete("")}
              onEdit={() => handleEdit("")}
              onComplete={() => handleComplete("")}
            />
          </tbody>
        </table>
        <button
          className="w-full p-2 flex gap-2 items-center text-gray-500 border-b border-gray-300 hover:bg-gray-200"
          onClick={handleCreate}>
          <GoPlus />
          <span>New Task</span>
        </button>
      </main>
    </>
  );
}

function Row({
  onEdit: handleEdit,
  onDelete: handleDelete,
  onComplete,
}: {
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}) {
  return (
    <tr>
      <td className="p-2  border-l-0  border border-gray-300">
        <input
          id="default-checkbox"
          type="checkbox"
          value=""
          onClick={onComplete}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </td>
      <td className="p-2 border border-gray-300">
        <div className="flex gap-1.5 items-center">
          <button className="p-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded h-fit">
            <FaCaretDown size={14} />
          </button>
          <p className="inline flex-1">Minum Kopi Sampai Kenyang</p>
          {/* <button className="px-2 py-0.5 text-sm  text-gray-600 rounded h-fit shadow-md font-semibold hover:bg-gray-200">SAVE
          </button> */}
        </div>
      </td>
      <td className="p-2 border border-gray-300">December 9, 2023 10:00 AM</td>
      <td className="p-2 border border-gray-300 text-center">100%</td>
      <td className="p-2  border-r-0  border border-gray-300 space-x-1 text-center">
        <button
          className="text-blue-600 bg-blue-100 p-1 rounded aspect-square"
          onClick={handleEdit}>
          <MdEdit />
        </button>
        <button
          className="text-red-600 bg-red-100 p-1 rounded aspect-square"
          onClick={handleDelete}>
          <MdDelete />
        </button>
      </td>
    </tr>
  );
}

function TaskForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="m-8 space-y-4">
      <h3 className="text-lg font-semibold">New Task</h3>
      <textarea
        // value={value}
        name="name"
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        placeholder="Describe your task"
        // onChange={onChange}
      />
      <input
        // value={value}
        name="date"
        type="datetime-local"
        className="border-2 border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded block w-full"
        placeholder="Describe your task"
        // onChange={onChange}
      />
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

export default App;
