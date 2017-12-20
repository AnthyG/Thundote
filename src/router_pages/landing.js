var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Landing = {
    beforeMount: function() {
        if (this.siteInfo != null && this.siteInfo.cert_user_id != null) {
            Router.navigate('/app');
            console.log("Redirected to /app", this.siteInfo);
            // return;
        }

        console.log("Loaded Landing-page", this.siteInfo);
    },
    computed: {
        goto: function(to) {
            Router.navigate(to);
        }
    },
    template: `
        <div>
            <h1>Thundote</h1>
            <h4>Please log in to use Thundote!</h4>
        </div>
    `
};

module.exports = Landing;