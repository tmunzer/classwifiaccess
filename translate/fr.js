// Login page
module.exports.login_page = {
    login_message:"Connexion à SchoolControl",
    username:"Nom d\'utilisateur",
    password:"Mot de passe",
    login_button:"Connexion",
    error_login_password: "Mauvais nom d'utilisateur ou mot de passe."
};

module.exports.user_button = {
    logout:"Déconnexion",
    account: "Compte",
    change_password: "Changer le mot passe",
    select_school:"Veuillez sélectionner une école..."
};

// Config page
//API
module.exports.config_page = {
    api_configuration:"Configuration de l'API",
    register:"Enregistrer l'API",
    user_mgmt:"Gestion des utilisateurs",
    classroom_mgmt:"Gestion des classes",
    school_mgmt:"Gestion des écoles",
//Users
    delete_api_title:"Voulez vous supprimer l'accès à cet API?",
    delete_user_title:"Voulez vous supprimer cet utilisateur?",
    delete_class_title:"Voulez vous supprimer cette classe?",
    delete_school_title:"Voulez vous supprimer cette école?",
    api_none:"Aucune",
    link_api_conf:"Paramètre de l'API",
    link_api_text:"Lier l'API à l'école ",
    school:"Ecole"
};
//AP

module.exports.config_classroom_page = {
    classroom:'Salle de classe',
    classroomName:"Nome de la salle de classe",
    device:"Point d'accès",
    school:"Ecole",
    new_classroom_button:"Nouvelle salle"
};

module.exports.config_user_page = {
    users:"Utilisateurs",
    user_account:"Compte utilisateur",
    firstName:"Prénom",
    lastName:"Nom",
    username:"Nom utilisateur",
    email:"Adresse e-mail",
    enable:"Utilisateur activé",
    lastLogin:"Dernière connexion",
    school:"Ecole",
    group:"Groupe",
    language:"Langue",
    password:"Mot de passe",
    confirm_password:"Confirmer le mot de passe",
    password_placeholder:"Non modifié",
    new_user_button:"Nouvel utilisateur"
};

module.exports.config_school_page = {
    school:"Ecole",
    schoolName:"Nom",
    new_school_button:"Nouvelle école",
    access_method: "Méthode d'accès pour configurer les points d'accès",
    api: "API",
    ssh: "SSH",
    ssh_warning: "Attention: Ce serveur doit pouvoir contacter l'adresse IP de chacun des points d'accès.",
    ssh_account: "Compte admin SSH",
    ssh_password: "Mot de passe admin SSH",
    ssh_password_confirm: "Confirmation du mot de passe admin SSH"
};

module.exports.buttons = {
    edit_button:"Modifier",
    back_button:"Retour",
    save_button:"Enregistrer",
    cancel_button:"Annuler",
    activate_button:"Activer",
    deactivate_button:"Désactiver",
    remove_button: "Supprimer"
};

module.exports.classroom_page = {
    enable : "Actif",
    disable: "Inactif",
    unknown: "Inconnu",
    enableWifiForClassroom: "Activer le Wi-Fi pour la salle ",
    wifiActivation: "Activation du Wi-Fi",
    disableWifiForClassroom: "Désactiver le Wi-Fi pour la salle ",
    wifiDeactivation: "Voulez-vous désactiver le Wi-Fi?",
    unlimited: "Jusqu'à désactivation manuelle",
    for: "Pour ",
    minutes: " minutes",
    untilDate: "jusqu'à ",
    device: "L'équipement ",
    isConnected: " est connecté.",
    isNotConnected: " n'est pas connecté.",
    noDeviceConfigured: "Il n'y a pas d'équipement configuré pour cette salle."
};

module.exports.lesson_page = {
    genericTitle: "Activations du Wi-Fi",
    classroomTitle: "Activations du Wi-Fi pour la classe ",
    school : "Ecole",
    classroom : "Salle de classe",
    startDate : "Date de début",
    endDate : "Date de fin",
    status: "Status",
    teacher: "Profresseur",
    action: "Action",
    finished : "Terminé",
    inProgress : "En cours",
    notStarted : "Non commencé",
    activateNow: "Activer le Wi-Fi maintenant",
    activateLater: "Planifier une activation du Wi-Fi",
    delete_lesson_title:"Voulez vous supprimer cette activation du Wi-Fi?",
    disableWifiForClassroom: "Désactiver le Wi-Fi pour la salle ",
    wifiDeactivation: "Voulez-vous désactiver le Wi-Fi?",
};

module.exports.activation_page = {
    genericTitle: "Activation du Wi-Fi",
    classroomTitle: "Activation du Wi-Fi pour la classe ",
    classroom: "Salle",
    startDate : "Date d'activation",
    endDate : "Désactivation ",
    unlimited: "Désactivation manuelle",
    for: "Après ",
    minutes: " minutes",
    untilDate: "Le "
};