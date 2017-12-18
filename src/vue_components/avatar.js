var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component("avatar-img", {
    props: {
        cert_user_id: String,
        size: {
            validator: function(value) {
                var sizes = ["", "xs", "sm", "lg", "xl"];

                return sizes.indexOf(value) !== -1;
            },
            default: ""
        }
    },
    computed: {
        initials: function() {
            return this.cert_user_id.substr(0, 2);
        },
        pixelSize: function() {
            var size = this.size;

            var sizes = ["", "xs", "sm", "lg", "xl"];
            var sizes2 = [1.6, .8, 1.2, 2.4, 3.2];

            var i = sizes.indexOf(size);

            if (i !== -1) return sizes2[i];
            else return 1.6;
        }
    },
    template: `
        <div>
            <figure v-if="this.cert_user_id" v-bind:class="'avatar ' + (this.size ? 'avatar-' + this.size : '')" v-bind:data-initial="initials"></figure>
            <i v-else class="mdi circle" v-bind:style="'font-size: ' + pixelSize + 'rem; width: ' + pixelSize + 'rem; height: ' + pixelSize + 'rem; background: #1de9b6;'">account_circle</i>
        </div>
    `
});

Vue.component("avatar", {
    props: {
        cert_user_id: String,
        size: {
            validator: function(value) {
                var sizes = ["", "xs", "sm", "lg", "xl"];

                return sizes.indexOf(value) !== -1;
            },
            default: ""
        }
    },
    computed: {
        initials: function() {
            return this.cert_user_id.substr(0, 2);
        }
    },
    template: `
        <div class="tile tile-centered">
            <div class="tile-icon">
                <avatar-img v-bind:cert_user_id="this.cert_user_id" v-bind:size="this.size"></avatar-img>
            </div>
            <div class="tile-content">
                <span>{{ this.cert_user_id }}</span>
            </div>
        </div>
    `
});