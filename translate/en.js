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
    change_password: "Change password"
};

// Config page
//API
module.exports.config_page = {
    api_configuration:"API configuration",
    register:"Register APP",
    user_mgmt:"Users management",
    classroom_mgmt:"Classrooms management",
    school_mgmt:"School management",
//Users
    delete_api_title:"Do you want to remove this API access?",
    delete_user_title:"Do you want to remove this user?",
    delete_class_title:"Do you want to remove this class?",
    delete_school_title:"Do you want to remove this school?",
    api_none:"None",
    link_api_conf:"API settings",
    link_api_text:"Link API to school ",
    cancel:"Cancel",
    remove:"Remove",
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
    password_placeholder:"Not changed",
    new_user_button:"New user"
};


module.exports.config_school_page = {
    school:"School",
    schoolName:"Name",
    new_school_button:"New school"
};

module.exports.buttons = {
    edit_button:"Edit",
    back_button:"Back",
    save_button:"Save",
    cancel_button:"Cancel",
    activate_button:"Activate",
    deactivate_button:"Deactivate"
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
    untilDate: "Until "
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
    activateLater: "Plan Wi-Fi activation"
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