import React from 'react';
import '../App.css';

class Inputbox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            isOpen: false,
            text: "",
            items: [],
            selectedItem: {}
        }
    }
    componentWillMount(){
        this.setState({
            name: this.props.name,
            items: this.props.items
        });
    }
    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            name: nextProps.name,
            items: nextProps.items
        });

    }
    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }
    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({isOpen: false});
        }
    }
    textChange = (e) => {
        if(e.currentTarget.value !== ""){
            this.setState({isOpen: true});
        }else{
            this.setState({isOpen: false});
        }
        this.setState({text: e.currentTarget.value});
    }
    setAspect = (item) =>{
        this.setState({text: item.value,isOpen: false,selectedItem: item});
        this.props.selectItem(item);
    }

    render(){
        let items = [];
        if(this.state.items !== undefined){
            for(let i=0; i < this.state.items.length;i++){
                if(this.state.items[i].value.toLowerCase().includes(this.state.text.toLowerCase())){
                    items.push(<p key = {i} onClick={e => this.setAspect(this.state.items[i])}>{this.state.items[i].value}</p>)
                }

            }
        };
        return(
            <div ref={this.setWrapperRef} className="Inputbox">
                <p>{this.state.name}</p>
                <input value={this.state.text} onChange={this.textChange}/>
                {
                    this.state.isOpen ? items.length === 0 ? <div className="Inputbox_items">Nothing find</div> : <div className="Inputbox_items">{items}</div> : <div/>
                }
            </div>
        )};
}

export default Inputbox;