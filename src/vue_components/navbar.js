var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component("navbar", {
    props: ['userInfo'],
    data: function() {
        return {
            searchFor: '',
            menuShown: false
        }
    },
    computed: {
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        }
    },
    methods: {
        toggleMenu: function(to) {
            if (to && typeof to === "boolean")
                this.menuShown = to;
            else
                this.menuShown = !this.menuShown;
        },
        toggleLeftSidebar: function() {
            this.$emit('toggleLeftSidebar');
        },
        logIn: function() {
            this.$emit('logIn');
        },
        logOut: function() {
            this.$emit('logOut');
        },
        goto: function(to) {
            this.menuShown = false;
            Router.navigate(to);
        },
        setSearch: function(s) {
            this.searchFor = s;
            console.log("Searching", s);
            this.$emit('setSearch', s);
        }
    },
    template: `
        <header class="navbar fixed">
            <nav class="navbar container grid-lg">
                <section class="navbar-section">
                    <a class="off-canvas-toggle btn btn-link btn-action" href="#sidebar-left" v-on:click.prevent="toggleLeftSidebar">
                        <i class="icon icon-menu"></i>
                    </a>
                    <!--
                    <ul class="tab">
                        <li class="tab-item active" v-on:click.prevent="goto('Home')">Home</li>
                    </ul>
                    -->
                </section>
                <section class="navbar-center">
                    <div class="input-group input-inline">
                        <input class="form-input" type="text" placeholder="search" v-bind:value="this.searchFor"
                        v-on:input="setSearch($event.target.value)">
                        <button class="btn btn-link btn-action input-group-btn"><i class="icon icon-search"></i></button>
                    </div>
                </section>
                <section class="navbar-section">
                    <div class="dropdown dropdown-right" v-bind:class="{'active': menuShown}">
                        <button class="btn btn-action btn-lg btn-link circle dropdown-btn" tabindex="0" v-on:focus="toggleMenu(true)" v-on:mousedown="toggleMenu" v-on:blur="toggleMenu(false)">
                            <div style="margin-top: -.3rem;">
                                <avatar-img v-if="isLoggedIn" v-bind:cert_user_id="userInfo.cert_user_id"></avatar-img>
                                <avatar-img v-else cert_user_id=""></avatar-img>
                            </div>
                        </button>
                        <ul class="menu light">
                            <li class="menu-item">
                                <avatar v-if="isLoggedIn" v-bind:cert_user_id="userInfo.cert_user_id" size="xl"></avatar>
                                <avatar v-else cert_user_id="" size="xl"></avatar>
                            </li>
                            <li class="divider"></li>
                            <li class="menu-item">
                                <a v-if="isLoggedIn" href="#Select+user" id="select_user" v-on:click.prevent="logOut">
                                    Log out
                                </a>
                                <a v-else href="#Select+user" id="select_user" v-on:click.prevent="logIn">
                                    Log in
                                </a>
                            </li>
                        </ul>
                    </div>
                </section>
            </nav>
        </header>
    `
});