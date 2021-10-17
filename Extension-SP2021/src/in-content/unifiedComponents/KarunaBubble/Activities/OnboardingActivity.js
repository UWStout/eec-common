import { ACTIVITIES } from './Activities.js'

// A pre-made multi-activity for onboarding a user
export const OnboardingActivity = {
  ...ACTIVITIES.ONBOARDING_ACTIVITY,
  message: {
    activityList: [
      { ...ACTIVITIES.KARUNA_MESSAGE, message: { content: 'Welcome to karuna! To get started, let\'s learn about your karuna status.' } },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Your MOOD STATUS is literally how you feel in general. It may also be how you feel about the project. It is important ' +
          'to be honest as it is a key part of building empathy with your team, however you can always choose weather or not to share ' +
          'your mood with the rest of your team'
        }
      },
      { ...ACTIVITIES.AFFECT_SURVEY, message: { isOnboarding: true } },
      { ...ACTIVITIES.PRIVACY_PROMPT, message: { isOnboarding: true } },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Your COLLABORATION STATUS is weather or not you are currently willing to work with someone else on the team. ' +
          'You might be OPEN to collaboration, ALREADY collaborating with someone, or FOCUSED and prefer not to collaborate.'
        }
      },
      { ...ACTIVITIES.COLLABORATION_SURVEY },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Your TIME-TO-RESPOND is a rough approximation of how long you hope to take before responding to any message from ' +
          'the team. This can change at any time if you become busy with other projects or just need some down time or are very engaged ' +
          'with this project.'
        }
      },
      { ...ACTIVITIES.TIME_TO_RESPOND_SURVEY },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Karuna will ask you questions from time to time right here, in the Karuna Bubble! It will display the statuses of ' +
          'your teammates that also use Karuna right when you need it. It will also prompt you to update your status from time to time. ' +
          'You can also update your status ANY TIME using the Karuna Connect Panel (the tab at the left edge of the browser window).'
        }
      },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'That\'s it! You are all set. We hope Karuna helps you build empathy within your team and improve communication. ' +
          'Enjoy your Karuna collaboration!'
        }
      }
    ]
  }
}
