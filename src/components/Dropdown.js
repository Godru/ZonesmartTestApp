import React from 'react';
import '../App.css';

class Dropdown extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isOpen: false,
            selectedItem: {},
            name: '',
            variableOfText: '',
            multiDropdown: false
        }
    }
    componentWillMount(){
        this.setState({
            items: this.props.items,
            name: this.props.name,
            variableOfText: this.props["variableOfText"],
            multiDropdown: this.props.multiDropdown
        });
        if(this.props.isOpen !== undefined){
            this.setState({isOpen:this.props.isOpen})
        }
        if(this.props.multiDropdown) {
            this.wrapperRef = this.props.categoryWrapperRef;
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            items: nextProps.items,
            name: nextProps.name,
            variableOfText: nextProps["variableOfText"],
            multiDropdown: nextProps.multiDropdown
        });
        if(nextProps.isOpen !== undefined){
            this.setState({isOpen: nextProps.isOpen})
        }
        if(nextProps.multiDropdown) {
            this.wrapperRef = nextProps.categoryWrapperRef;
        }
    }
    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    openDropdown = () =>{
        this.setState({isOpen:!this.state.isOpen});
    }
    setItem = (index) =>{
        this.setState({selectedItem: this.state.items[index]});
        this.props.selectItem(this.state.items[index]);
        if(!this.state.multiDropdown){
            this.setState({isOpen: false});
        }


    }
    setWrapperRef = (node) => {
        if(!this.state.multiDropdown){
            this.wrapperRef = node;
        }
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({isOpen: false});
        }
    }
    render(){
        let items = undefined;
        if(this.state.items){
            items = this.state.items.map((item,i) => {
                return (<li onClick={e => this.setItem(i)} key={i}>{this.state.items[i][this.state.variableOfText]}
                {this.state.multiDropdown ? item['is_leaf'] ? <div className="triangle_down"/> : <div className="triangle_right"/> : <div/>} </li>)
            });
        }
        let margin = {
            marginLeft: 25,
            marginRight: 25
        }
        if(this.state.multiDropdown){
            margin.marginRight = 0;
            margin.marginLeft = 0;
        }
        return(
            <div className="Dropdown" style={margin}>
                <p>{this.state.name}</p>
                <div ref={this.setWrapperRef}>
                    <div onClick={this.openDropdown} className="Dropdown_box">
                        <p>{this.state.selectedItem[this.state.variableOfText]}</p>
                        <div className="triangle_down"/>
                    </div>
                    {
                        this.state.isOpen ? <ul  className="Dropdown__items">{items}</ul > : <ul className="Dropdown__items"/>
                    }
                </div>
            </div>
        )};
}

export default Dropdown;