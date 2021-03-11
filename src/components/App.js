import React, { Component } from 'react'
import AddAppointments from './AddAppointments'
import ListAppointments from './ListAppointments'
import SearchAppointments from './SearchAppointments'
import '../css/App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      myAppointments: [],
      formDisplay: false,
      lastIndex: 0,
      orderBy: 'petName',
      orderDir: 'asc',
      queryText: ''
    }
  }
  toggleForm = () => {
    this.setState({formDisplay: !this.state.formDisplay})
  }
  deleteAppointment = appointment => {
    let tempApts = this.state.myAppointments.filter(apt => apt !== appointment)
    this.setState({
      myAppointments: tempApts
    })
  }
  
  updateInfo = (field, replacementText, id) => {
    let tempApt = this.state.myAppointments.map(apt => {
      if (apt.aptId === id) {
        apt[field] = replacementText
      }
      return apt
    })
    this.setState({
      myAppointments: tempApt
    })
    console.log(this.state.myAppointments);

  }

  addAppointment = appointment => {
    let tempApt = this.state.myAppointments
    appointment.aptId = this.state.lastIndex
    tempApt.unshift(appointment)
    this.setState({
      myAppointments: tempApt,
      lastIndex: this.state.lastIndex + 1
    });
  }
  filterSearch = (query) => {
    this.setState({
      queryText: query
    })
  }
  componentDidMount() {
    fetch('./data.json')
      .then(data => data.json())
      .then(result => {
        const apts = result.map(item => {
          item.aptId = this.state.lastIndex
          this.setState({ lastIndex: this.state.lastIndex + 1 })
          return item
        })
        this.setState({
          myAppointments: apts
        })
      })
  }
  changeOrder = (order, direction) => {
    this.setState({
      orderDir: direction,
      orderBy: order
    })
  }
  render() {
    let order;
    let filterApts = this.state.myAppointments
    if (this.state.orderDir === 'asc') {
      order = 1
    } else {
      order = -1
    }
    filterApts = filterApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order
      } else {
        return 1 * order
      }
    }).filter(item => item.petName
        .toLowerCase()
        .includes(this.state.queryText) 
        || 
        item.ownerName
        .toLowerCase()
        .includes(this.state.queryText) 
        || 
        item.aptNotes
        .toLowerCase()
        .includes(this.state.queryText))
    return (
      <main className="page bg-white" id="petratings">
      <div className="container">
        <div className="row">
          <div className="col-md-12 bg-white">
            <div className="container">
              <AddAppointments formDisplay={this.state.formDisplay} toggleForm={this.toggleForm} addAppointment = {this.addAppointment}/>
              <SearchAppointments orderBy={this.state.orderBy} orderDir={this.state.orderDir} changeOrder={this.changeOrder} handleSearchQuery={this.filterSearch}/>
              <ListAppointments updateInfo ={this.updateInfo} appointments = {filterApts} deleteAppointment = {this.deleteAppointment}/>
            </div>
          </div>
        </div>
      </div>
    </main>
    );
  }
  
}

export default App;
