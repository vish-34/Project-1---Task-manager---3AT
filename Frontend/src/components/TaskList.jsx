import { useEffect, useRef } from "react";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";

export default function TaskList({ tasks, onDelete, onToggle }) {
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

  useEffect(() => {
    if (!tableRef.current) {
      return undefined;
    }

    const tableElement = tableRef.current;
    const dataTable = new DataTable(tableElement, {
      data: tasks,
      pageLength: 6,
      lengthMenu: [6, 10, 20, 50],
      responsive: true,
      autoWidth: false,
      language: {
        search: "",
        searchPlaceholder: "Search tasks",
        lengthMenu: "Show _MENU_ tasks",
        info: "Showing _START_ to _END_ of _TOTAL_ tasks",
        infoEmpty: "No tasks available",
        emptyTable: "No tasks have been added yet.",
        zeroRecords: "No matching tasks found",
        paginate: {
          previous: "Prev",
          next: "Next",
        },
      },
      columns: [
        {
          title: "Task",
          data: "title",
          defaultContent: "",
          render: (value, _, row) => `
            <div class="task-cell">
              <span class="task-title">${value}</span>
              <span class="task-meta">Task ID: ${row.id}</span>
            </div>
          `,
        },
        {
          title: "Status",
          data: "isCompleted",
          render: (value) =>
            value
              ? '<span class="status-pill status-complete">Completed</span>'
              : '<span class="status-pill status-pending">Pending</span>',
        },
        {
          title: "Actions",
          data: null,
          orderable: false,
          searchable: false,
          render: (_, __, row) => `
            <div class="action-group">
              <button
                type="button"
                data-action="toggle"
                data-id="${row.id}"
                data-status="${!row.isCompleted}"
                class="table-action table-action-primary"
              >
                ${row.isCompleted ? "Mark Pending" : "Mark Complete"}
              </button>
              <button
                type="button"
                data-action="delete"
                data-id="${row.id}"
                class="table-action table-action-danger"
              >
                Delete
              </button>
            </div>
          `,
        },
      ],
    });

    const handleTableClick = (event) => {
      const button = event.target.closest("button[data-action]");

      if (!button) {
        return;
      }

      const action = button.dataset.action;
      const taskId = Number(button.dataset.id);

      if (action === "toggle") {
        onToggle(taskId, button.dataset.status === "true");
      }

      if (action === "delete") {
        onDelete(taskId);
      }
    };

    tableElement.addEventListener("click", handleTableClick);
    dataTableRef.current = dataTable;

    return () => {
      tableElement.removeEventListener("click", handleTableClick);

      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [onDelete, onToggle]);

  useEffect(() => {
    if (!dataTableRef.current) {
      return;
    }

    dataTableRef.current.clear();
    dataTableRef.current.rows.add(tasks);
    dataTableRef.current.draw(false);
  }, [tasks]);

  return (
    <div className="task-table-shell">
      <table ref={tableRef} className="display task-table w-full" />
    </div>
  );
}
