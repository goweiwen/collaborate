import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
const style = { resize: 'none', height: '100%', width: '100%', overflow: 'auto' };

// TODO PERSIST FORM
class PollForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { answers: [] };
  }

  handleAddAnswer() {
    this.setState((prevState) => {
      const newAnswers = [...prevState.answers];
      newAnswers.push('');
      return { answers: newAnswers };
    });
  }

  handleRemoveAnswer() {
    this.setState((prevState) => {
      const newAnswers = [...prevState.answers];
      newAnswers.pop('');
      return { answers: newAnswers };
    });
  }

  handleAnswerChange(i) {
    this.setState((prevState) => {
      const newAnswers = [...prevState.answers];
      newAnswers[i] = event.target.value;

      return { answers: newAnswers };
    });
  }

  handleQuestionChange() {
    this.setState(() => ({ question: event.target.value }));
  }

  handlePollCreation() {
    const { question, answers } = this.state;

    const voted = {};
    const newPollTile = { id: this.props.id, answers, question, voted };
    this.props.updateTile(newPollTile);
  }

  render() {
    return (<div style={style}>
      <div className="field">
        <label className="label">Question</label>
        <div className="control is-expanded">
          <input className="input" type="text" placeholder="Question" onChange={this.handleQuestionChange.bind(this)} />
        </div>
      </div>
      {this.state.answers.map((answer, i) => (<div className="field" key={i}>
        <div className="control is-expanded">
          <input onChange={this.handleAnswerChange.bind(this, i)}className="input" type="text" placeholder="Answer" />
        </div>
      </div>))
              }
      <button onClick={this.handleAddAnswer.bind(this)}>Add Answer</button>
      <button onClick={this.handleRemoveAnswer.bind(this)}>Remove Answer</button>
      <button onClick={this.handlePollCreation.bind(this)}>Create Poll</button>
    </div>);
  }
}

PollForm.propTypes = {
  updateTile: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};


export default class Poll extends React.Component {

  handleSelectAnswer(i) {
    const { voted, id, updateTile } = this.props;

    const newVoted = { ...voted };
    newVoted[user] = i;
    updateTile({ id, voted: newVoted });
  }


  render() {
    const { voted, answers, question, owner, updateTile, id } = this.props;

    if (answers === undefined) {
      if (user === owner) { return <div style={style}><PollForm updateTile={updateTile} id={id} /></div>; }
      return <div className="notification is-info">Poll Being Created</div>;
    } else if (user in voted) {
      return (<div style={style} className="content is-paddingless is-marginless">
        <div className="table">
          <th>{question}</th>
          {answers.map((answer, i) => {
            let count = 0;
            _.forEach(voted, (vote) => {
              if (vote === i) {
                count++;
              }
            });
            return (<tr key={i}>
              <td>{answer}</td>
              <td>{count}</td>
            </tr>);
          })
                  }
        </div>
      </div>);
    }
    return (<div style={style} className="content is-paddingless is-marginless">
      <div className="table">
        <th>{question}</th>
        {answers.map((answer, i) => (<tr key={i}>
          <td>{answer}</td>
          <td><button className="button is-primary" onClick={this.handleSelectAnswer.bind(this, i)} >Vote!</button></td>
        </tr>))
                      }
      </div>
    </div>);
  }
}


Poll.propTypes = {
  voted: PropTypes.object,
  answers: PropTypes.array,
  question: PropTypes.string,
  owner: PropTypes.string.isRequired,
  updateTile: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
};

Poll.contextTypes = {
  socket: PropTypes.object,
};

