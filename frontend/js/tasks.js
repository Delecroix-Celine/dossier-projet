// CONFIGURATION SIMULÉE POUR CAPTURES D'ÉCRAN
document.getElementById("welcomeMessage").innerText = "Bienvenue Céline";

// Notre base de données temporaire en mémoire
let tasks = [
    { id: 1, title: "Concevoir la base de données", description: "Création du MCD et du script SQL des tables users et tasks.", status: "Terminée", created_at: "2026-06-15" },
    { id: 2, title: "Développer l'API REST", description: "Mettre en place les routes Express et les middlewares de sécurité.", status: "En cours", created_at: "2026-06-16" },
    { id: 3, title: "Finaliser le dossier de projet", description: "Prendre les captures d'écran et rédiger la conclusion.", status: "À faire", created_at: "2026-06-17" }
];

// ====================
// AFFICHER LES TÂCHES
// ====================
async function loadTasks() {
    // Nombre total de tâches
    document.getElementById("taskCounter").innerText = `Nombre de tâches : ${tasks.length}`;

    // Nombre de tâches terminées
    const completedTasks = tasks.filter(task => task.status === "Terminée");
    document.getElementById("completedCounter").innerText = `Tâches terminées : ${completedTasks.length}`;

    // Pourcentage de progression
    const percent = tasks.length === 0 ? 0 : Math.round(completedTasks.length * 100 / tasks.length);
    document.getElementById("progressPercent").innerText = `Progression : ${percent} %`;
    document.getElementById("progressFill").style.width = percent + "%";

    displayTasks(tasks);
}

// ====================
// COMPOSER LE HTML
// ====================
function displayTasks(tasksToDisplay) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (tasksToDisplay.length === 0) {
        taskList.innerHTML = "<h3>Aucune tâche à afficher</h3>";
        return;
    }

    tasksToDisplay.forEach(task => {
        let colorClass = task.status === "À faire" ? "todo" : task.status === "En cours" ? "progress" : "done";
        const taskDate = new Date(task.created_at).toLocaleDateString('fr-FR');

        taskList.innerHTML += `
        <div class="${colorClass}">
            <h3>${task.title}</h3>
            <p>${task.description || "Aucune description"}</p>
            <p><strong>Statut :</strong> ${task.status}</p>
            <p><strong>Créée le :</strong> ${taskDate}</p>
            <button onclick="editTask(${task.id}, '${task.title.replace(/'/g, "\\'")}', '${(task.description || "").replace(/'/g, "\\'")}', '${task.status}')">
                <i class="fa-solid fa-pen"></i> Modifier
            </button>
            <button onclick="deleteTask(${task.id})">
                <i class="fa-solid fa-trash"></i> Supprimer
            </button>
        </div>
        <hr>
        `;
    });
}

// ====================
// AJOUTER UNE TÂCHE
// ====================
const taskForm = document.getElementById("taskForm");
if (taskForm) {
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;

        const newTask = {
            id: Date.now(),
            title,
            description,
            status: "À faire",
            created_at: new Date().toISOString().split('T')[0]
        };

        tasks.unshift(newTask); // Ajoute au début
        alert("Tâche ajoutée avec succès !");
        taskForm.reset();
        loadTasks();
    });
}

// ====================
// SUPPRIMER UNE TÂCHE
// ====================
function deleteTask(id) {
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        tasks = tasks.filter(t => t.id !== id);
        alert("Tâche supprimée avec succès !");
        loadTasks();
    }
}

// ====================
// MODIFIER UNE TÂCHE (Remplir les champs)
// ====================
function editTask(id, title, description, status) {
    if(document.getElementById("editId")) {
        document.getElementById("editId").value = id;
        document.getElementById("editTitle").value = title;
        document.getElementById("editDescription").value = description;
        document.getElementById("editStatus").value = status;
    }
}

// ====================
// ENREGISTRER LA MODIFICATION
// ====================
const editForm = document.getElementById("editForm");
if (editForm) {
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById("editId").value);
        
        tasks = tasks.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    title: document.getElementById("editTitle").value,
                    description: document.getElementById("editDescription").value,
                    status: document.getElementById("editStatus").value
                };
            }
            return t;
        });

        alert("Tâche modifiée avec succès !");
        editForm.reset();
        loadTasks();
    });
}

// ====================
// FILTRER LES TÂCHES
// ====================
function filterTasks(status) {
    const filtered = tasks.filter(task => task.status === status);
    displayTasks(filtered);
}

// ====================
// RECHERCHE
// ====================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", () => {
        const keyword = searchInput.value.toLowerCase();
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(keyword) ||
            (task.description || "").toLowerCase().includes(keyword)
        );
        displayTasks(filtered);
    });
}

// ====================
// DÉCONNEXION
// ====================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        alert("Déconnexion réussie");
        window.location.href = "login.html";
    });
}

// DÉMARRAGE AUTOMATIQUE
loadTasks();