import React from 'react';
import '../App.css';

class CategoryMenu extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isOpen: false,
            selectedItem: {},
            name: '',
            warning: false,
            activeCategories: 0,
            multiDropdown: false
        }
    }
    componentWillMount(){
        this.setState({
            items: this.props.items,
            activeCategories: this.props.activeCategories
        });

    }
    componentWillReceiveProps(nextProps){
        this.setState({
            items: nextProps.items,
            activeCategories: nextProps.activeCategories
        });

    }
    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    openDropdown = () =>{
        this.setState({isOpen:!this.state.isOpen});
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;

    }
    setWrapperExeption = (node) => {
        this.wrapperExeption = node;

    }
    handleClickOutside = (event) => {
        if (this.wrapperExeption && this.wrapperRef &&
            !this.wrapperRef.contains(event.target) && !this.wrapperExeption.contains(event.target)) {
            this.setState({isOpen: false,warning: false});
        }
    }
    selectItem = (item) =>{
        this.props.selectItem(item);
        if(item["is_leaf"]){
            this.setState({isOpen: false});
        }
    }
    openCategory = () =>{
        if(this.state.activeCategories > 0 ){
            this.setState({isOpen: !this.state.isOpen, activeCategories: 1})
        }else {
            this.setState({warning: true})
        }
    }
    render(){
        let items = [];
        console.log(this.state.items);
        if(this.state.items){
            for(let i=0;i<this.state.activeCategories;i++ ){
                items.push(<ul key={i} className="category__list"> {this.state.items[i].map((item,i) => {
                    return (<li onClick={e => this.selectItem(item)} key={i}>{item["name"]}
                        {item['is_leaf'] ? <div className="triangle_down"/> : <div className="triangle_right"/>} </li>)
                  })}
                </ul>)
            }

        }
        return(
            <div className="CategoryMenu">
                <div ref={this.setWrapperExeption} onClick = {this.openCategory} className="category__open">
                    Select category
                    <div className="triangle_right"/>
                </div>
                {this.state.warning ? <div className="warning">Firstly select channel!</div>: <div/>}
                <div className="categoty__place">
                    {this.state.isOpen ? <div ref={this.setWrapperRef} className="category__menu"> {items} </div>: <div ref={this.setWrapperRef}/>}
                </div>
            </div>
        )};
}

export default CategoryMenu;