var fr = {
    layout: {
        logout:"Déconnexion",
        details: "Compte",
        classrooms: "Salles de classe",
        schedules: "Planning",
        devices: "Équipements",
        settings: "Paramètres",
        school: "École"
    },
    button: {
        change_password: "Changer le mot passe",
        select_school:"Veuillez sélectionner une école...",
        language: "language",
        menu: "menu",
        activateNow: "Activer le Wi-Fi maintenant",
        activateLater: "Planifier une activation du Wi-Fi",
        edit_button:"Modifier",
        back_button:"Retour",
        close: "Fermer",
        save_button:"Enregistrer",
        cancel_button:"Annuler",
        activate_button:"Activer",
        deactivate_button:"Désactiver",
        remove_button: "Supprimer",
        search: "Rechercher",
        filter: "Filtre",
        enable: 'Activer',
        disable: "Désactiver",
        plan: "Planifier activation"
    },
    modals: {
        confirm: "Demande de confirmation",
        removeApi: "Voulez vous supprimer l'accès à cet API?",
        removeSchool: "Voulez vous supprimer cette école?",
        removeUser: "Voulez vous supprimer cet utilisateur?",
        removeClassroom: "Voulez vous supprimer cette salle de classe?",
        removeSchedule:"Voulez vous supprimer cette activation du Wi-Fi?",
        disableWifiForClassroom: "Désactiver le Wi-Fi pour cette salle de classe?",
        wifiDeactivation: "Voulez-vous désactiver le Wi-Fi?"
    },
    classroom: {
        notConfigured: "Salle de classe sans Point d'Accès",
        notConnected: "Salle de classe avec Point d'Accès déconnecté",
        enable : "Wi-Fi activé",
        disable: "Wi-Fi désactivé",
        unknown: "Status Wi-Fi inconnu",
        enableWifiForClassroom: "Activer le Wi-Fi pour la salle ",
        wifiActivation: "Activation du Wi-Fi",
        wifiDeactivation: "Voulez-vous désactiver le Wi-Fi?",
        unlimited: "Jusqu'à désactivation manuelle",
        timeLimited: "Pendant une durée limitée",
        dateLimited: "Jusqu'à une date définie",
        durationValue: "Durée d'activation (en minutes)",
        untilValue: "Date de désactivation",
        isConnected: "L'équipement {{hostName}} est connecté.",
        isNotConnected: "L'équipement {{hostName}} n'est pas connecté.",
        noDeviceConfigured: "Il n'y a pas d'équipement configuré pour cette salle."
    },
    device: {
        showSwitch: "Switch",
        showAP: "Point d'Accès",
        status: "Status",
        connected: "Connecté",
        disconnected: "Non connecté",
        connectedDevices: "Équipements connectés",
        macAddress: "Adresse MAC",
        serialNumber: "Numéro de série",
        ipAddress: "Adresse IP",
        location: "Site"
    },
    schedule: {
        genericTitle: "Activation du Wi-Fi",
        classroomTitle: "Activation du Wi-Fi pour la classe ",
        unlimited: "Désactivation manuelle",
        for: "Après ",
        minutes: " minutes",
        untilDate: "Le ",
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
        disableWifiForClassroom: "Désactiver le Wi-Fi pour la salle "
    },
    settings: {
        classroom: {
            title:"Gestion des classes",
            classroom:'Salle de classe',
            classroomName:"Nom de la salle de classe",
            modal_title: "Paramètres de la salle de classe",
            device:"Point d'accès",
            school:"Ecole",
            action: "Action",
            new_classroom_button:"Nouvelle salle",
            deviceStatus: "Status du point d'accès"
        },
        user: {
            title:"Gestion des utilisateurs",
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
            action: "Action",
            confirm_password:"Confirmer le mot de passe",
            password_placeholder:"Mot de passe non modifié",
            new_user_button:"Nouvel utilisateur",
            delete_user_title:"Voulez vous supprimer cet utilisateur?",
            modal_title: "Paramètres utilisateur",
            changePassword: "Changer le mot de passe"
        },
        school: {
            title:"Gestion des écoles",
            school:"Ecole",
            schoolName:"Nom",
            action: "Action",
            new_school_button:"Nouvelle école",
            modal_title: "Paramètre de l'école",
            access_method: "Méthode d'accès pour configurer les points d'accès",
            api: "API",
            ssh: "SSH",
            ssh_warning: "Attention: Ce serveur doit pouvoir contacter l'adresse IP de chacun des points d'accès.",
            ssh_account: "Compte admin SSH",
            ssh_password: "Mot de passe SSH",
            ssh_password_confirm: "Confirmation du mot de passe SSH",
            password_placeholder:"Mot de passe non modifié",
            delete_class_title:"Voulez vous supprimer cette classe?",
            delete_school_title:"Voulez vous supprimer cette école?"
        },
        api: {
            title:"Configuration de l'API",
            register:"Enregistrer l'API",
            delete_api_title:"Voulez vous supprimer l'accès à cet API?",
            api_none:"Aucune",
            link_api_conf:"Paramètre de l'API",
            link_api_text:"Lier l'API à l'école ",
            school:"Ecole",
            action: "Action",
            expireAt: "Date d'expiration"
        }
    },

};

// Login page
/*module.exports.login_page = {
    login_message:"Connexion à SchoolControl",
    username:"Nom d\'utilisateur",
    password:"Mot de passe",
    login_button:"Connexion",
    error_login_password: "Mauvais nom d'utilisateur ou mot de passe."
};

module.exports.user_button = {

};


    */