import React, { Component } from 'react'

class MessagesList extends Component {
    render() {
        const styles = {
            container: {
                overflow: 'auto',
                flex: 1,
                marginLeft: 20
            },
            ul: {
                listStyle: 'none',
            },
            li: {
                marginTop: 13,
                marginBottom: 13,
            },
            senderUsername: {
                fontWeight: 'bold',
                color: 'brown'
            },
            currentUsername: {
                fontWeight: 'bold',
                color: 'blueviolet'
            },
            message: { fontSize: 15 },
        }
        return (
            <div
                style={{
                    ...this.props.style,
                    ...styles.container,
                }}
            >
                <ul style={styles.ul}>
                    {this.props.messages.map((message, index) => (
                        <li key={index} style={styles.li}>
                            <div>
                                <span style={message.senderId !== this.props.currentUser ? styles.senderUsername : styles.currentUsername}>
                                    {message.senderId}
                                </span>{' '}
                            </div>
                            <p style={styles.message}>{message.text}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default MessagesList