const apiUrl = "http://localhost:5000/api";

const token = localStorage.getItem("token");

document.getElementById(
    "welcomeMessage"
).innerText =
    "Bienvenue Céline";


// ====================
// AFFICHER LES TÂCHES
// ====================

async function loadTasks() {

    const response = await fetch(
        `${apiUrl}/tasks`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    let tasks = await response.json();

    // Trier les tâches de la plus récente à la plus ancienne

    tasks.sort(

        (a, b) =>

            new Date(b.created_at)

            -

            new Date(a.created_at)

    );

    // Nombre total de tâches

    document.getElementById(
        "taskCounter"
    ).innerText =
        `Nombre de tâches : ${tasks.length}`;

    // Nombre de tâches terminées

    const completedTasks =
        tasks.filter(
            task => task.status === "Terminée"
        );

    document.getElementById(
        "completedCounter"
    ).innerText =
        `Tâches terminées : ${completedTasks.length}`;

    // Pourcentage de progression

    const percent =
        tasks.length === 0
            ? 0
            : Math.round(
                completedTasks.length * 100 / tasks.length
            );

    document.getElementById(
        "progressPercent"
    ).innerText =
        `Progression : ${percent} %`;

    document.getElementById(
        "progressFill"
    ).style.width =
        percent + "%";

    displayTasks(tasks);

}


// ====================
// AFFICHER LES TÂCHES
// ====================

function displayTasks(tasks) {

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        taskList.innerHTML = `

            <h3>
                Aucune tâche à afficher
            </h3>

        `;

        return;

    }

    tasks.forEach(task => {

        let colorClass = "";

        if (task.status === "À faire") {

            colorClass = "todo";

        }

        else if (task.status === "En cours") {

            colorClass = "progress";

        }

        else {

            colorClass = "done";

        }

        taskList.innerHTML += `

        <div class="${colorClass}">

            <h3>${task.title}</h3>

            <p>${task.description}</p>

            <p>

                <strong>Statut :</strong>

                ${task.status}

            </p>

            <p>

                <strong>Créée le :</strong>

                ${new Date(
                    task.created_at
                ).toLocaleDateString('fr-FR')}

            </p>

            <button onclick="editTask(
                ${task.id},
                '${task.title}',
                '${task.description}',
                '${task.status}'
            )">

                <i class="fa-solid fa-pen"></i>

                Modifier

            </button>

            <button onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

                Supprimer

            </button>

        </div>

        <hr>

        `;

    });

}


// ====================
// AJOUTER UNE TÂCHE
// ====================

const taskForm =
    document.getElementById("taskForm");

taskForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        await fetch(
            `${apiUrl}/tasks`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`

                },

                body: JSON.stringify({

                    title,
                    description

                })

            }
        );

        alert(
            "Tâche ajoutée avec succès !"
        );

        taskForm.reset();

        loadTasks();

    }
);


// ====================
// SUPPRIMER UNE TÂCHE
// ====================

async function deleteTask(id) {

    const confirmation =
        confirm(
            "Voulez-vous vraiment supprimer cette tâche ?"
        );

    if (!confirmation) {

        return;

    }

    await fetch(
        `${apiUrl}/tasks/${id}`,
        {

            method: "DELETE",

            headers: {

                Authorization:
                    `Bearer ${token}`

            }

        }
    );

    alert(
        "Tâche supprimée avec succès !"
    );

    loadTasks();

}


// ====================
// MODIFIER UNE TÂCHE
// ====================

function editTask(
    id,
    title,
    description,
    status
) {

    document.getElementById(
        "editId"
    ).value = id;

    document.getElementById(
        "editTitle"
    ).value = title;

    document.getElementById(
        "editDescription"
    ).value = description;

    document.getElementById(
        "editStatus"
    ).value = status;

}


// ====================
// FORMULAIRE DE MODIFICATION
// ====================

const editForm =
    document.getElementById("editForm");

editForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const id =
            document.getElementById(
                "editId"
            ).value;

        const title =
            document.getElementById(
                "editTitle"
            ).value;

        const description =
            document.getElementById(
                "editDescription"
            ).value;

        const status =
            document.getElementById(
                "editStatus"
            ).value;

        await updateTask(
            id,
            title,
            description,
            status
        );

        editForm.reset();

    }
);


// ====================
// METTRE À JOUR
// ====================

async function updateTask(
    id,
    title,
    description,
    status
) {

    await fetch(
        `${apiUrl}/tasks/${id}`,
        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`

            },

            body: JSON.stringify({

                title,
                description,
                status

            })

        }
    );

    alert(
        "Tâche modifiée avec succès !"
    );

    loadTasks();

}


// ====================
// FILTRER LES TÂCHES
// ====================

async function filterTasks(status) {

    const response = await fetch(
        `${apiUrl}/tasks`,
        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }
    );

    const tasks =
        await response.json();

    const filteredTasks =
        tasks.filter(
            task => task.status === status
        );

    displayTasks(filteredTasks);

}


// ====================
// RECHERCHE
// ====================

document
    .getElementById("searchInput")
    .addEventListener(
        "keyup",
        async () => {

            const keyword =
                document
                    .getElementById(
                        "searchInput"
                    )
                    .value
                    .toLowerCase();

            const response = await fetch(
                `${apiUrl}/tasks`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const tasks =
                await response.json();

            const filteredTasks =
                tasks.filter(task =>

                    task.title
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    (task.description || "")
                        .toLowerCase()
                        .includes(keyword)

                );

            displayTasks(filteredTasks);

        }
    );


// ====================
// DÉCONNEXION
// ====================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "token"
            );

            alert(
                "Déconnexion réussie"
            );

            window.location.href =
                "login.html";

        }
    );


// ====================
// DÉMARRAGE
// ====================

loadTasks();