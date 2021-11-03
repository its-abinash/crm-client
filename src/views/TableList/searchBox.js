import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import lodash from "lodash";

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    event.preventDefault()
    this.props.onChange();
    this.props.callback.GetUserData(lodash.trim(event.target.value));
  }

  render() {
    return (
      <div style={{height: "100px"}}>
        <Form.Control
          size="lg"
          type="text"
          placeholder="Search clients by their designation, email, name or phone no."
          name="query"
          onChange={this.onChange}
          autoComplete="off"
        />
      </div>
    );
  }
}

export default SearchBox;
