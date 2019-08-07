import React, { Component } from 'react'

class FriendsList extends Component {

    handleClick(event) {
        this.props.onFriendChat(event.target.getAttribute('value'));
    }

    render() {
        const styles = {
            container: {
                flex: 1,
            },
            ul: {
                listStyle: 'none',
                marginTop: 5
            },
            li: {
                marginBottom: 5,
                color: 'indigo',
                cursor: 'pointer',
            }
        }
        return (
            <div
                style={{
                    ...this.props.style,
                    ...styles.container,
                }}
            >
                <ul style={styles.ul}>
                    {this.props.friendsList.map((friend) => (
                        <li key={friend.id} value={friend.id} style={styles.li}
                            className={this.props.currentFriendId === friend.id ? 'team-active' : ''}
                            onClick={this.handleClick.bind(this)}>
                            {friend.name}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default FriendsList