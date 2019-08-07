import React, { Component } from 'react'

class SendMessageForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
        }
        this.onSubmit = this.onSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }
    onSubmit(e) {
        e.preventDefault()
        this.props.onSubmit(this.state.text)
        this.setState({ text: '' })
    }
    onChange(e) {
        this.setState({ text: e.target.value })
        if (this.props.onChange) {
            this.props.onChange()
        }
    }
    render() {
        const styles = {
            container: {
                padding: 10,
                borderTop: '1px #4C758F solid',
                backgroundColor: '#f2f2f2',
                bottom: 0,
                position: 'fixed',
                width: '100%',
            },
            form: {
                display: 'flex',
            },
            input: {
                color: 'inherit',
                background: 'none',
                outline: 'none',
                border: 'none',
                flex: 1,
                fontSize: 16,
            },
        }
        return (
            <div style={styles.container}>
                <div>
                    <form onSubmit={this.onSubmit} style={styles.form}>
                        <input
                            type="text"
                            placeholder="Type message and press ENTER"
                            onChange={this.onChange}
                            value={this.state.text}
                            style={styles.input}
                        />
                    </form>
                </div>
            </div>)
    }
} export default SendMessageForm