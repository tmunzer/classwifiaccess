// Login page
/*module.exports.login_page = {
    login_message:"Sign in to SchoolControl",
    username:"Username",
    password:"Password",
    login_button:"Sign in",
    error_login_password: "Invalid username or password."
};
*/


// Config page
//API
var en = {
    layout: {
        details: "account",
        logout: "logout",
        classrooms: "Classrooms",
        schedules: "Schedules",
        devices: "devices",
        settings: "settings",
        school: "School"
    },
    button: {
        language: "language",
        menu: "menu",
        change_password: "Change password",
        select_school:"Please select a school...",
        edit_button:"Edit",
        back_button:"Back",
        save_button:"Save",
        cancel_button:"Cancel",
        close: "Close",
        activate_button:"Activate",
        deactivate_button:"Deactivate",
        remove_button: "Remove",
        activateNow: "Activate Wi-Fi now",
        activateLater: "Plan Wi-Fi activation",
        search: "Search",
        filter: "Filter",
        enable: 'Enable',
        disable: "Disable",
        plan: "Plan activation"
    },
    modals: {
        confirm: "Confirmation request",
        removeApi: "Do you want to remove this API token?",
        removeSchool:  "Do you want to remove this school?",
        removeUser:  "Do you want to remove this user?",
        removeClassroom: "Do you want to remove this classroom?",
        removeSchedule:"Do you want to remove this Wi-Fi activation?",
        disableWifiForClassroom: "Deactivate Wi-Fi for this classroom ",
        wifiDeactivation: "Do you want to deactivate Wi-Fi?"
    },
    classroom: {
        notConfigured: "Classroom without Access Point",
        notConnected: "Classroom with disconnected Access Point",
        enable : "Wi-Fi Enable",
        disable: "Wi-Fi Disable",
        unknown: "Unknown Wi-Fi Status",
        duration: "Duration",
        enableWifiForClassroom: "Activate Wi-Fi for room ",
        wifiDeactivation: "Do you want to deactivate Wi-Fi?",
        wifiActivation: "Wi-Fi Activation",
        unlimited: "Until manual deactivation",
        timeLimited: "For a limited period of time",
        dateLimited: "Until a defined date",
        durationValue: "Active time (in minutes)",
        untilValue: "Deactivation date",
        isConnected: "Device {{hostName}} is connected.",
        isNotConnected: "Device {{hostName}} is not connected.",
        noDeviceConfigured: "There is no device configured for this classroom."
    },
    device: {
        showSwitch: "Switch",
        showAP: "Access Point",
        status: "Status",
        connected: "Connected",
        disconnected: "Not connected",
        connectedDevices: "Connected Devices",
        macAddress: "MAC Address",
        serialNumber: "Serial Number",
        ipAddress: "IP Address",
        location: "Location"
    },
    schedule: {
        genericTitle: "Wi-Fi activation",
        classroomTitle: "Wi-Fi activation for classroom ",
        unlimited: "Until manual deactivation",
        for: "After  ",
        minutes: " minutes",
        untilDate: "Until ",
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
        disableWifiForClassroom: "Deactivate Wi-Fi for room "
    },
    settings: {
        classroom: {
            title:"Classrooms management",
            classroom:'Classroom',
            classroomName:"Classroom name",
            modal_title: "Classroom parameters",
            device:"Access point",
            school:"School",
            action: "Action",
            new_classroom_button:"New classroom",
            deviceStatus: "Device status"
        },
        user: {
            title:"Users management",
            user:"Users",
            user_account:"User account",
            firstName:"First name",
            lastName:"Last name",
            username:"Username",
            email:"E-mail address",
            enable:"User enabled",
            lastLogin:"Last connection",
            school:"School",
            group:"Group",
            action: "Action",
            language:"Language",
            password:"Password",
            confirm_password:"Confirm password",
            password_placeholder:"Password not changed",
            new_user_button:"New user",
            delete_user_title:"Do you want to remove this user?",
            modal_title: "User Parameters",
            changePassword: "Change password"
        },
        school: {
            title:"Schools management",
            school:"School",
            action: "Action",
            schoolName:"Name",
            new_school_button:"New school",
            modal_title: "School parameters",
            access_method: "Access method to configure the Access Points",
            api: "API",
            ssh: "SSH",
            ssh_warning: "Warning: This server has to be able to contact each Access Point IP Address.",
            ssh_account: "SSH admin login",
            ssh_password: "SSH password",
            ssh_password_confirm: "Confirm SSH password",
            password_placeholder:"Password not changed",
            delete_class_title:"Do you want to remove this class?",
            delete_school_title:"Do you want to remove this school?"
        },
        api: {
            title:"API configuration",
            register:"Register APP",
            delete_api_title:"Do you want to remove this API access?",
            api_none:"None",
            link_api_conf:"API settings",
            link_api_text:"Link API to school ",
            school:"School",
            action: "Action",
            expireAt: "expire at"
        }
    }

};
//AP
/*
module.exports.config_classroom_page = {

};

module.exports.config_user_page = {

};


module.exports.config_school_page = {

};

module.exports.buttons = {
};


module.exports.lesson_page = {

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
    */