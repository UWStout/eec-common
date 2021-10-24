import { ACTIVITIES } from './Activities.js'

// A pre-made multi-activity for onboarding a user
export const AffectSurveyActivity = {
  ...ACTIVITIES.AFFECT_SURVEY,
  message: {
    activityList: [
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'You haven\'t updated your mood in a while. Let\'s take care of that!'
        }
      },
      { ...ACTIVITIES.AFFECT_SURVEY },
      { ...ACTIVITIES.PRIVACY_PROMPT },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Thank you! Your mood has been updated. You should also consider updating your ' +
          'COLLABORATION status and your TIME-TO-RESPOND in the Karuna Connect Panel.'
        }
      }
    ]
  }
}

// Same activity that skips the privacy prompt
export const AffectSurveyNoPromptActivity = {
  ...ACTIVITIES.AFFECT_SURVEY,
  message: {
    activityList: [
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'You haven\'t updated your mood in a while. Let\'s take care of that!'
        }
      },
      { ...ACTIVITIES.AFFECT_SURVEY },
      {
        ...ACTIVITIES.KARUNA_MESSAGE,
        message: {
          content: 'Thank you! Your mood has been updated. You should also consider updating your ' +
          'COLLABORATION status and your TIME-TO-RESPOND in the Karuna Connect Panel.'
        }
      }
    ]
  }
}
