import React from 'react';
import './App.css';
import axios from 'axios';
import Dropdown from './components/Dropdown.js'
import Inputbox from './components/Inputbox.js'
const email = "admin@zonesmart.ru";
const password = "4815162342";
const url = "http://utss.su/api";
let token = undefined;
let refresh = undefined;
let categoryWrapperRef;

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            channels: [],
            channel: {},
            categories: [[]],
            activeCategories: 1,
            id: '',
            aspects: [],
            openDropdown: undefined,
            loadingAspects: false
        }
        this.selectChannel = this.selectChannel.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
        this.parseCategories = this.parseCategories.bind(this);
        this.setCategories = this.setCategories.bind(this);
        this.getAspects = this.getAspects.bind(this);
    }
    componentDidMount(){
        axios.post(url + "/auth/jwt/create/", {
            "email": email,
            "password": password
        })
            .then(function(response) {
                token = response.data["access"];
                refresh = response.data["refresh"];
                return response
            })
           /* .then(response => this.selectChannel({
                channel: 2
            }))*/
            .then(response => axios.get(url + "/user_channel/",{
                headers: {
                    'Authorization': 'JWT ' + token
                }
            })
                .then(response => this.setState({channels: response.data.results}))
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }

    async refreshApi(){
        await axios.post(url + "/auth/jwt/refresh/", {
            "refresh": refresh,
        })
            .then(response => token = response.data["access"])
            .catch(err => console.log(err))
    };
    async checkAuthApi(){
        await axios.post(url + "/auth/jwt/verify/", {
            "token": token,
        })

            .catch(err => this.refreshApi())

    };
    async selectChannel(item){
        let categories = [[]];
        categories = this.state.categories;
        await this.checkAuthApi();
        await axios.get(url + "/ebay/product/category/?level=1&parent_id=&channel_id="+ item.channel +"&is_leaf=False&category_id=&variations_supported=",{
            headers: {
                'Authorization': 'JWT ' + token
            }
        })
            .then(response => categories[0] = response.data.results)
            .then(response => this.setState({categories: categories, channel: item.channel, activeCategories: 1,openDropdown: true,aspects: []}))
            .catch(err => console.log(err));
    }
    setCategories(response,item){
        if(!item["is_leaf"]){
            let categories = [[]];
            categories = this.state.categories;
            categories[item.level] = response.data.results;
            this.setState({categories: categories,activeCategories: item.level + 1,openDropdown: true,aspects: []});
        }else{
            this.setState({id: item.id,openDropdown: false});
            this.getAspects();
        }
    }
    async selectCategory(item){
        await this.checkAuthApi();
        await axios.get(url + "/ebay/product/category/?level="+(item.level+1)+
            "&parent_id="+ item.category_id+"&channel_id="+ this.state.channel +"&is_leaf=&category_id=",{
            headers: {
                'Authorization': 'JWT ' + token
            }
        })
            .then(response => this.setCategories(response,item))
            .catch(err => console.log(err));
    }
     getAspects(){
        this.setState({loadingAspects: true});
        axios.get(url + "/ebay/product/category/" + this.state.id +"/aspect/?aspectEnabledForVariations=&itemToAspectCardinality=&aspectRequired=",{
            headers: {
                'Authorization': 'JWT ' + token
            }
        })
            .then(response => this.setState({aspects: response.data['results'],loadingAspects: false}))
            .catch(err => console.log(err));
    }
    setCategoryWrapperRef = (node) => {
         categoryWrapperRef = node;
    }

    selectAspect = (item) =>{
        console.log("Selected aspect: " + item.value)
    }
    parseCategories(){
        let categories = [];
        for(let i=0; i<this.state.activeCategories;i++){
            categories.push(<Dropdown node = {this.state.node} multiDropdown = {true} isOpen = {this.state.openDropdown} key ={i} variableOfText = {"name"}
                                      name ={"Category level: " + (i + 1)} categoryWrapperRef = {categoryWrapperRef} items = {this.state.categories[i]}
                                      selectItem = {this.selectCategory}/>)
        }
        return categories
    }
    render(){
        let aspects = this.state.aspects.map((item,i) => {
            if(item['aspectMode'] === 'SELECTION_ONLY'){
                return (<Dropdown multiDropdown = {false} key = {i} selectItem = {this.selectAspect} variableOfText = {"value"} items = {item["aspect_values"]} name = {item["localizedAspectName"]}/>)
            }else{
                return (<Inputbox key = {i} selectItem = {this.selectAspect} items = {item["aspect_values"]} name = {item["localizedAspectName"]}/>)
            }
        });
        return (
          <div className="App">
              <Dropdown multiDropdown = {false} variableOfText = {"name"} name = {"Select channel"}
                        items = {this.state.channels} selectItem = {this.selectChannel}/>
              <div ref={this.setCategoryWrapperRef} className="categories">
                  {this.parseCategories()}
              </div>
              <div className="aspects">
                  {
                      this.state.loadingAspects ? <div className="loading">Loading aspects</div> : aspects.length > 0 ? aspects : <p/>
                  }
              </div>
          </div>
        )};
}

export default App;