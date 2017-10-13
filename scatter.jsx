var React = require("React"),
linmap = require("linmap"),
jsonist = require("jsonist");


module.exports = React.createClass({

  getInitialState: () => ({
      data: [],
      selected: null
  }),

  componentWillMount() {
      var self = this;
      jsonUrl = window.location.origin + "/public/iris.json";
      jsonist.get(jsonUrl, function(err, data) {

          if (err) return 

          var lengthMin, lengthMax, widthMin, widthMax;

          data.forEach(function(element, index) {

            element.id = index,
            lengthMin || (lengthMin = element.petalLength),
            lengthMax || (lengthMax = element.petalLength),
            widthMin || (widthMin = element.petalWidth),
            widthMax || (widthMax = element.petalWidth),
            element.petalLength < lengthMin && (lengthMin = element.petalLength),
            element.petalLength > lengthMax && (lengthMax = element.petalLength),
            element.petalWidth < widthMin && (widthMin = element.petalWidth),
            element.petalWidth > widthMax && (widthMax = element.petalWidth)
          });

          self.setState({
              data: data,
              lengthMin: lengthMin,
              lengthMax: lengthMax,
              widthMin: widthMin,
              widthMax: widthMax
          });
      });
  },

  renderItem(value) {
    var widthMin = this.state.widthMin
        widthMax = this.state.widthMax
        lengthMin = this.state.lengthMin
        lengthMax = this.state.lengthMax
        leftPosition = linmap(widthMin, widthMax, 0, 1, value.petalWidth)
        bottomPosition = linmap(lengthMin, lengthMax, 0, 1, value.petalLength)
        itemsStyle = {
            background: {
                setosa: "#ff7f0e",
                virginica: "#1f77b4",
                versicolor: "#2ca02c"
            }
            [value.species],
            width: 10,
            height: 10,
            position: "absolute",
            left: leftPosition * this.props.width - 5,
            bottom: bottomPosition * this.props.height - 5,
            cursor: "pointer",
            borderRadius: 5
        };
        
    return (this.state.selected || {}).id === value.id && (itemsStyle.border = "1px solid white"), React.createElement("div", {
        key: Math.random(),
        style: itemsStyle,
        onMouseEnter: this.selectItem.bind(this, value),
        onMouseLeave: this.selectItem.bind(this, null)
    })
  },
  
  renderSelected: value => value ? React.createElement("table", null, React.createElement("tbody", null, Object.keys(value).reverse().map(function(key) {
      return React.createElement("tr", { key: key }, React.createElement("td", null, "id" === key ? "i" : key, ":"), React.createElement("td", null, value[key]))
  }))) : "",

  selectItem(item) {
      this.setState({
          selected: item
      })
  },

  render() {

      var mainStyle = {
          position: "relative",
          color: "rgba(255, 255, 255, 0.7)",
          background: "#222",
          border: "1px solid black",
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.5)",
          width: this.props.width,
          height: this.props.height
      };

      return React.createElement("div", {
          style: mainStyle
      },

      React.createElement("div", null, this.state.data.map(this.renderItem)),

      React.createElement("div", null, this.renderSelected(this.state.selected)))
  }
})