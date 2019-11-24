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
        }
    }
    componentWillMount(){
        this.setState({
            items: this.props.items,
            name: this.props.name,
            variableOfText: this.props["variableOfText"]
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
            variableOfText: nextProps["variableOfText"]
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
        this.setState({isOpen: false});



    }
    setWrapperRef = (node) => {
        this.wrapperRef = node;
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
                return (<li onClick={e => this.setItem(i)} key={i}>{this.state.items[i][this.state.variableOfText]}</li>)
            });
        }

        return(
            <div className="Dropdown" >
                <p>{this.state.name}</p>
                <div ref={this.setWrapperRef}>
                    <div onClick={this.openDropdown} className="Dropdown_box">
                        <p>{this.state.selectedItem[this.state.variableOfText]}</p>
                        <div className="triangle_down"/>
                    </div>
                    {
                        this.state.isOpen ? <ul  className="Dropdown__items">{items}</ul > : <div/>
                    }
                </div>
            </div>
        )};
}

export default Dropdown;