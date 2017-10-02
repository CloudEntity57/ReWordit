import React, { Component } from 'react';
import logo from './Antique_Isle_Typewriter.png';
import './App.css';
import thesaurus from 'thesaurus';
import nlp from 'compromise';
var num = nlp('five-hundred and twenty')
num.values().toNumber();

console.log(num.out('text'));

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      translated:'reworded text appears here',
      verbs:false,
      nouns:false,
      adjectives:false,
      adverbs:false
    }
  }
  synonym(word,str,idx,num){
    num=num || 0;
    let results;
    //ignore all gerunds (ing)
    let ger = word.split('').slice(word.length-3,word.length).join('');
    if(ger==='ing'){
      return word;
    }
    let is_caps = true;
    if(word && word[0].toLowerCase() === word[0]){
      is_caps = false;
    }
    const adj = nlp(word).adjectives().data();
    const adv = nlp(word).adverbs().data();
    const verb = nlp(word).verbs().data();
    const noun = nlp(word).nouns().data();
    console.log('pos - ',word,': ',' adj- ',adj,' noun- ',noun,' adv- ',adv,' verb- ',verb);
    if(this.exceptions(word.toLowerCase())){
      return word;
    }
    let syn = thesaurus.find(word.toLowerCase());
    let filler=Math.random()*syn.length/2;
    filler = Math.floor(filler);
    results = syn[filler];
    console.log('syn: ',results);
    // if resulting synonym is more than one word, do recursion
    if(results && results.split(' ').length>1){
      num++;
      return (num<10) ? this.synonym(word,str,idx,num) : word;
    }
    if(is_caps && results){
      results = results.split('');
      results[0]=results[0].toUpperCase();
      results = results.join('');
    }
    if(noun.length){
      return (this.state.nouns) ? (results || word) : word;
    }
    if(adj.length){
      return (this.state.adjectives) ? (results || word) : word;
    }
    if(adv.length){
      return (this.state.adverbs) ? (results || word) : word;
    }
    if(verb.length){
      return (this.state.verbs) ? (results || word) : word;
    }
    return word;
  }
  exceptions(word){
    let exceptions = 'i in out being you we they who whom or and if from to my your her his their with be not no yes without too also as a an the this that am are were may might can will do did not he she it which one'.split(' ');
    console.log(exceptions);
    console.log(exceptions.indexOf(word),' is where ',word,' is.');
    if(exceptions.indexOf(word) !==-1){
      console.log(word,' is an exception');
      return true;
    }
    return false;
  }
  print_text(e){
    e.preventDefault();
    let str = this.refs.text.value;
    console.log(str);
  }
  submitForm(e){
    e.preventDefault();
    console.log('processing ',this.refs.text.value);
    let str = this.refs.text.value.split(' ');
    for(const idx in str){
      let word = str[idx];
      let plural = false;
      let syn = this.synonym(word,str,idx);
      str.splice(idx,1,syn);
    }
    console.log(str.join(' '));
    const translated = str.join(' ');
    this.setState({
      translated
    });
    document.getElementsByClassName('App-logo');
  }
  addPos(e){
    const pos = e.target.value;
    console.log('setting: ',this.state[pos]);
    this.setState({
      [e.target.value]:!this.state[pos]
    });
  }
  render() {
    const translated = this.state.translated || '';
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">ReWordit</h1>
        </header>
        <p className="App-intro">
          To get started, enter text below:
        </p>
        <form className="form" onSubmit={this.submitForm.bind(this)}>
          <textarea ref="text" className="form-control main-input"></textarea>
          <input className="rdo" onChange={ this.addPos.bind(this)} type="checkbox" id="nouns" name="pos" value="nouns" />Nouns
          <input className="rdo" onClick={ this.addPos.bind(this)} type="checkbox" id="verbs" value="verbs" />Verbs
          <input className="rdo" onClick={ this.addPos.bind(this)} type="checkbox" id="adverbs" value="adverbs" />Adverbs
          <input className="rdo" onClick={ this.addPos.bind(this)} type="checkbox" id="adjectives" value="adjectives" />Adjectives
          <button className="btn btn-primary" type="submit">Reword</button>
        </form>
        <div className="panel panel-default results">
        {translated}
        </div>
      </div>
    );
  }
}

export default App;
