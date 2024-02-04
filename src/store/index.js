
import {reactive} from "vue";

const store = {
    state:reactive({
        duanziList:[],
    }),
    setDzList(list){
        this.state.duanziList = list
    },
}

export default store;