<template>
  <ScreenNotification  position="top" v-model:message="alert_message" v-model:is_shown="show_notification" ref="screen_notification" @update:is_shown="onUpdateIsShown"/>

  <div class="column-flex">
    <div class="wrap">
      <a href="https://adamantus.com/" target="_blank">
      <img src="../assets/logo-adamantus-2022.svg" class="logo adamantus" alt="Adamantus logo" />
      <!-- <input type="button" value="Invoke Alert" @click.prevent="invokeAlert"> -->
    </a>      
    </div>
    <div class="wrap main-content">
      <template v-if="loaded">
        <div class="other-controls">
          <div class="control-wrapper">
            <label for="save-selection" class="upper fs-0-9">Load Saved: </label>
            <input type="checkbox" name="save-selection" id="save-selection" v-model="load_selection" @change="saveLoadSelection">
            <p class="fs-0-7">auto load from saved settings</p>
          </div>
          <div class="control-wrapper">
            <input v-show="load_selection && show_save_btn" :class="{'btn' : true}" type="button" name="save-selection" value="Save" @click.prevent="onSaveSelection">
          </div>          
        </div>        
        <div class="time-controls">
          <div class="date-wrapper">
            <span class="upper fs-0-7">Older than: </span>
            <Datepicker v-model="starting_date"  @update:modelValue="handleDate" :enableTimePicker="false" />
            <!-- <p class="fs-0-7">show files older than the chosen date</p> -->
          </div>
          <div class="date-wrapper">
            <span class="upper fs-0-7">Younger than: </span>
            <Datepicker v-model="ending_date"  @update:modelValue="handleDate" :enableTimePicker="false" />
            <!-- <p class="fs-0-7">show files younger than the chosen date</p> -->
          </div>
        </div>
        <div class="other-controls right">
          <div v-show="starting_date || ending_date" class="status-text">
            <span class="fs-0-7">showing files last modified from: </span><span class="date-label">{{filters.date_format(starting_date)}}</span><span class="fs-0-7"> to: </span><span class="date-label">{{filters.date_format(ending_date)}}</span>
          </div>
        </div>  
        <RecursivefileVue :files="files" @notify-screen="onNotifyScreen"></RecursivefileVue>
      </template>
      <template v-else>
        <div class="flex-wrapper">
            <div class="loader"></div>
        </div>        
      </template>
    </div>  
    <div class="on-the-bottom">
      <div class="wrap">
        <div style="text-align:center">
          <span class="fs-0-9">© {{year}} Adamantus </span> | <span class="fs-0-9"><a href="https://adamantus.com"> adamantus.com </a></span>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import RecursivefileVue from './Recursivefile.vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import ScreenNotification from './ScreenNotification.vue';
import filters from '../includable/filters';

export default {
  // Properties returned from data() become reactive state
  // and will be exposed on `this`.
  props : {

    count : {
      type : Number,
      default : 0
    }
  },
  components : {
    RecursivefileVue,
    ScreenNotification,
    Datepicker
  },  
  setup(props,context){

    const files = ref([]);
    const loaded = ref(false);
    const starting_date = ref(null);
    const ending_date = ref(null);
    const load_selection = ref(true);
    const show_notification = ref(false);
    const alert_message = ref('');
    const show_save_btn = ref(false)

    return {
      files : files,
      loaded : loaded,
      load_selection : load_selection,
      starting_date : starting_date,
      ending_date : ending_date,
      show_notification : show_notification,
      alert_message : alert_message,
      show_save_btn : show_save_btn,
      filters:filters
    }
  },  

  computed : {
    year : ()=>{
      return (new Date()).getFullYear();
    }
  },  
  watch : {
  },
  methods: {
    screenNotificationShown(message_object){
      console.log(message_object);
    },
    onNotifyScreen(){
      console.log('heeeeeelllooo')
    },  
    saveLoadSelection(){

      if(localStorage){
        localStorage.setItem('load_selection',this.load_selection);
        if(this.load_selection)
          this.$refs.screen_notification.showMessage('Next time you load the page, settings will be autoloaded','success');
        else
          this.$refs.screen_notification.showMessage('Next time you load the page, settings will not be loaded');

      }      
    },
    onUpdateIsShown(value){
      // console.log(value);
      // console.log(this.show_notification)
    },
    invokeAlert(){
        this.show_notification = !this.show_notification
        if(this.show_notification){
          if(this.$refs.screen_notification)
            this.$refs.screen_notification.showMessage();
        }
        else{
          if(this.$refs.screen_notification)
            this.$refs.screen_notification.hideMessage();          
        }
    },
    async handleDate(modelData){
      //this little trick will force a redraw
      this.loaded = false;
      this.show_save_btn = true;
      await this.grabData();
    },
    onSaveSelection(){
      this.updateLocalStorage();
      this.show_save_btn = false;
    },    
    updateLocalStorage(){

      let starting_date_local = null;
      let ending_date_local = null;

      if(this.starting_date){
        starting_date_local = new Date(this.starting_date) / 1000;
      }

      if(this.ending_date){
        ending_date_local = new Date(this.ending_date) / 1000;
      }      

      if( localStorage ){
        localStorage.setItem('starting_date',starting_date_local);
        localStorage.setItem('ending_date',ending_date_local);
        localStorage.setItem('load_selection',this.load_selection)

        if(this.$refs.screen_notification)
            this.$refs.screen_notification.showMessage('Settings saved into localStorage','success');

      }

    },
    async grabData(){

      let starting_date_local = null;
      let ending_date_local = null;

      if(this.starting_date){
        starting_date_local = new Date(this.starting_date) / 1000;
      }

      if(this.ending_date){
        ending_date_local = new Date(this.ending_date) / 1000;
      }   
      let params = {
        cut_date: starting_date_local, 
        cut_date_end: ending_date_local
      };

      const username = 'adamantus';
      const password= 'lemon7';
      const res = await axios.get('https://dev.afk.mk/images/api.php', {
        params: params ,
        headers: {
          authorization: "Basic " + btoa(username + ":" + password)
        }
      });

      this.files = res.data;
      this.loaded = true;    
      
     

    }
  },

  async mounted() {

    //check localstorage first
    if(localStorage){
      const load_selection = localStorage.getItem('load_selection');

      if(load_selection !== null){
        this.load_selection = (load_selection =='true') ? true : false;
      }
      else{
        this.load_selection = false
      }

    }

    if(this.load_selection){
      const start_date_local = localStorage.getItem('starting_date');
      const end_date_local = localStorage.getItem('ending_date');
      
      if(start_date_local && typeof +start_date_local ==='number' && !isNaN(start_date_local)){
        let time_is = +start_date_local;
        let the_date = new Date(time_is * 1000)
        this.starting_date = the_date;
      }
  
      if(end_date_local && typeof +end_date_local ==='number' && !isNaN(end_date_local)){
        let time_is = +end_date_local;
        let the_date = new Date(time_is * 1000)
        this.ending_date = the_date;      
      }
    }


    await this.grabData();

  }
}
</script>

<style scoped>

  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
    
  }
  .logo.adamantus:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }  
  .time-controls{
    display: flex;
    flex-flow:row wrap;
    gap:1em;
    margin-bottom:1em;
  }
  .other-controls{
    display: flex;
    justify-content: left;
    gap:1rem;
  
  }

  .other-controls .status-text{
    width: 100%;
    padding:0.6em;
  }
  .other-controls.right{
    justify-content: right;
  }

  .other-controls > .control-wrapper{
    width:100%
  }
  .other-controls > .control-wrapper ~ .control-wrapper{
    width:auto;
  }

  .control-wrapper{
    min-height: 3rem;  
  }

  .control-wrapper p{
    margin: 0;
    padding:0;
  }
  .date-label{
    padding: 0.2em;
    background: #3498db;
    border-radius: 5px;
    color:#fff;
    text-shadow:1px 1px #333;
    font-size:0.9em;
  }
  .control-wrapper input{
    margin:0;
    padding:0;
  }
  .control-wrapper input.btn{
    padding:1em;
    border: none;
  }
  .control-wrapper input.btn:hover{
    cursor: pointer;
    background: #ddd;
    box-shadow: 0px 0px 10px #efefef;
  }
  .date-wrapper{
    flex: 1 1 0;
  }
  
  .column-flex{
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    justify-content: space-between;
  }
  .main-content{
    min-height: 70vh;
  }
  .on-the-bottom{
    /* position: fixed; */
    bottom: 0px;
    width: 100%;
  
  }
  .flex-wrapper{
    width:100%;
    display: flex;
    min-height: 60vh;
    justify-content: center;
    flex-flow: column;
  }

  
  
  </style>
