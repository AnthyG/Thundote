var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Reminders = {
    beforeMount: function() {
        if (this.userInfo == null || this.userInfo.cert_user_id == null) {
            Router.navigate('');
            console.log("Redirected to LP", this.userInfo);
        } else {
            this.$emit('getReminders');
        }
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        checkReminders: Function,
        reminders: Array
    },
    template: `
        <div>
            <h1>Reminders</h1>
            <ul v-if="checkReminders != false">
                <li v-for="(reminder, i) in reminders">
                    {{ JSON.stringify(reminder) }}
                </li>
            </ul>
            <div v-else>
                <h5>You have no reminders.</h5>
            </div>
        </div>
    `
};

module.exports = Reminders;