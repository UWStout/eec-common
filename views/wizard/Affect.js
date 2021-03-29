/**
 * An object to represent an affect for our canned messages
 *
 * should look like this when converted to JSON:
 * { "name": "First name", "message": "{{user.firstName}}", "trigger": "", "action": "", "description": "insert user's first name where the text insertion cursor is", "overwrite": false },
 */
class Affect {
  /**
       * Constructor for an Affect
       * @param {string} name  the character code of the affect followed by its name
       * @param {string} message the affectID for setting the user status
       * @param {string} description the description of the affect
       */
  constructor (name, message, description) {
    this.name = name
    this.message = message
    this.description = description
  }

  static fromJSON (json) {
    // const parsed = JSON.parse(jsonString)
    const newAffect = new Affect(json.characterCodes[0] + ' ' + json.name, '{{' + json._id + '}}', json.description)
    return newAffect
  }

  stringify () {
    return JSON.stringify(this, null, 2)
  }
}

// Exposing the Affect object to other files
export default Affect
