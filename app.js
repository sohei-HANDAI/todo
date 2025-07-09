// Service Workerの登録
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered: ', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyMessage = document.getElementById('empty-message');

    // ローカルストレージからタスクを読み込む
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // タスクリストの表示を更新する関数
    const renderTasks = () => {
        // リストをクリア
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyMessage.classList.remove('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item flex items-center p-4 border-b border-gray-200 transition duration-200 ${task.completed ? 'bg-gray-50' : ''}`;
                taskItem.dataset.id = task.id;

                // タスク完了のチェックボックス
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = task.completed;
                checkbox.className = 'form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer';
                checkbox.addEventListener('change', () => toggleComplete(task.id));
                
                // タスクのテキスト
                const taskText = document.createElement('span');
                taskText.className = `task-text flex-grow mx-4 text-gray-700 ${task.completed ? 'line-through text-gray-400' : ''}`;
                taskText.textContent = task.text;
                taskText.addEventListener('click', () => toggleComplete(task.id));

                // 削除ボタン
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn bg-red-500 hover:bg-red-600 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center transition duration-300';
                deleteBtn.innerHTML = '&times;'; // '×' symbol
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                taskItem.appendChild(checkbox);
                taskItem.appendChild(taskText);
                taskItem.appendChild(deleteBtn);
                taskList.appendChild(taskItem);
            });
        }
        // ローカルストレージに保存
        saveTasks();
    };

    // タスクをローカルストレージに保存する関数
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // タスクを追加する関数
    const addTask = (text) => {
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(newTask);
        renderTasks();
    };

    // タスクを削除する関数
    const deleteTask = (id) => {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    // タスクの完了状態を切り替える関数
    const toggleComplete = (id) => {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        renderTasks();
    };

    // フォームの送信イベント
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text !== '') {
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    // 初期表示
    renderTasks();
});
