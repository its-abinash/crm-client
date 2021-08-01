import React, { Component } from "react";
import Select from "react-select";

const options = [
  { value: "+93", label: "Afghanistan" },
  { value: "+355", label: "Albania" },
  { value: "+1-684", label: "American Samoa" },
  { value: "+376", label: "Andorra" },
  { value: "+244", label: "Angola" },
  { value: "+1-264", label: "Anguilla" },
  { value: "+672", label: "Antarctica" },
  { value: "+91", label: "india" },
];

class SelectDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ""
    }
  }
  render() {
    return (
      <Select
        options={this.props.default ? options : this.props.options}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
      />
    );
  }
}

export default SelectDropdown;
