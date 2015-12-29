// Login page
module.exports.login_page = {
    login_message:"Sign in to SchoolControl",
    username:"Username",
    password:"Password",
    login_button:"Sign in",
    error_login_password: "Invalid username or password."
};

module.exports.user_button = {
    logout:"Logout",
    account: "account",
    change_password: "Change password",
    select_school:"Please select a school..."
};

// Config page
//API
module.exports.config_page = {
    api_configuration:"API configuration",
    register:"Register APP",
    user_mgmt:"Users management",
    classroom_mgmt:"Classrooms management",
    school_mgmt:"Schools management",
//Users
    delete_api_title:"Do you want to remove this API access?",
    delete_user_title:"Do you want to remove this user?",
    delete_class_title:"Do you want to remove this class?",
    delete_school_title:"Do you want to remove this school?",
    api_none:"None",
    link_api_conf:"API settings",
    link_api_text:"Link API to school ",
    school:"School"
};
//AP

module.exports.config_classroom_page = {
    classroom:'Classroom',
    classroomName:"Classroom name",
    device:"Access point",
    school:"School",
    new_classroom_button:"New classroom"
};

module.exports.config_user_page = {
    users:"Users",
    user_account:"User account",
    firstName:"First name",
    lastName:"Last name",
    username:"Username",
    email:"E-mail address",
    enable:"User enabled",
    lastLogin:"Last connection",
    school:"School",
    group:"Group",
    language:"Language",
    password:"Password",
    confirm_password:"Confirm password",
    password_placeholder:"Password not changed",
    new_user_button:"New user"
};


module.exports.config_school_page = {
    school:"School",
    schoolName:"Name",
    new_school_button:"New school",
    access_method: "Access method to configure the Access Points",
    api: "API",
    ssh: "SSH",
    ssh_warning: "Warning: This server has to be able to contact each Access Point IP Address.",
    ssh_account: "SSH admin login",
    ssh_password: "SSH admin password",
    ssh_password_confirm: "Confirm SSH admin password",
    password_placeholder:"Password not changed",
};

module.exports.buttons = {
    edit_button:"Edit",
    back_button:"Back",
    save_button:"Save",
    cancel_button:"Cancel",
    activate_button:"Activate",
    deactivate_button:"Deactivate",
    remove_button: "Remove"
};

module.exports.classroom_page = {
    enable : "Enable",
    disable: "Disable",
    unknown: "Unknown",
    duration: "durée",
    enableWifiForClassroom: "Activate Wi-Fi for room ",
    disableWifiForClassroom: "Deactivate Wi-Fi for room ",
    wifiDeactivation: "Do you want to deactivate Wi-Fi?",
    wifiActivation: "Wi-Fi Activation",
    unlimited: "Until manual deactivation",
    for: "For  ",
    minutes: " minutes",
    untilDate: "Until ",
    device: "Device ",
    isConnected: " is connected.",
    isNotConnected: " is not connected.",
    noDeviceConfigured: "There is no device configured for this classroom."
};

module.exports.lesson_page = {
    genericTitle: "Wi-Fi activations",
    classroomTitle: "Wi-Fi activations for classroom ",
    school : "School",
    classroom : "Classroom",
    startDate : "Start date",
    endDate : "End date",
    status: "Status",
    teacher: "Teacher",
    action: "Action",
    finished : "Finished",
    inProgress : "In progress",
    notStarted : "Not started",
    activateNow: "Activate Wi-Fi now",
    activateLater: "Plan Wi-Fi activation",
    delete_lesson_title:"Do you want to remove this Wi-Fi activation?",
    disableWifiForClassroom: "Deactivate Wi-Fi for room ",
    wifiDeactivation: "Do you want to deactivate Wi-Fi?",
};

module.exports.activation_page = {
    genericTitle: "Wi-Fi activation",
    classroomTitle: "Wi-Fi activation for classroom ",
    classroom: "Classroom",
    startDate : "Activation Date",
    endDate : "Deactivate on",
    unlimited: "Until manual deactivation",
    for: "After  ",
    minutes: " minutes",
    untilDate: "Until "
};