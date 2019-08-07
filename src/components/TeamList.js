import React, { Component } from 'react'
import Lock from '@material-ui/icons/Lock';
import LockOpen from '@material-ui/icons/LockOpen';

class TeamList extends Component {

    handleClickEvent(event) {
        this.props.onTeamChange(event.target.value);
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
                    {this.props.userTeams.map((team) => (
                        <li key={team.id} value={team.id} style={styles.li}
                            className={this.props.currentTeamId === team.id ? 'team-active' : ''}
                            onClick={this.handleClickEvent.bind(this)}>
                            {team.name}
                            { team.isPrivate ? <Lock /> : <LockOpen />}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default TeamList