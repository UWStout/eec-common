// Import nodemailer for sending emails
import nodemailer from 'nodemailer'

// Import the handlebars template library and commonmark MD parser
import Handlebars from 'handlebars'
import * as Commonmark from 'commonmark'

// Import the 'debug' library
import Debug from 'debug'

// Initialize DotENV and sendin blue auth object
import DotENV from 'dotenv'
DotENV.config()

// Require at least 5 minutes between emails (per user)
const MINS_BETWEEN_EMAILS = 5

// Sendin blue config
const SMTP_SIB_CONFIG = {
  service: 'SendinBlue',
  auth: {
    user: (process.env.SIB_SMTP_USER || 'unknown'),
    pass: (process.env.SIB_SMTP_PW || 'bad-pass')
  }
}

// Should we send, or is this just a test?
const SMTP_SEND = (process.env.SMTP_SEND === 'true')

// Create debug interface
const debug = Debug('karuna:server:emailHelper')

// Prepare to parse and render Markdown
const MDReader = new Commonmark.Parser({ smart: true })
const MDWriter = new Commonmark.HtmlRenderer()

// Global generic from email
const fromEmail = 'noreply@karuna.run'

// Job to send out emails (not meant to be awaited, let run in background)
export async function sendEmail (userInfo, subject, bodyTextMarkdown) {
  // Throttle email sending
  if (userInfo?.lastEmail?.timestamp) {
    const elapsedMinutes = (new Date() - new Date(userInfo.lastEmail.timestamp)) / 60000
    if (elapsedMinutes < MINS_BETWEEN_EMAILS) {
      debug(`Throttling email attempt after ${elapsedMinutes.toFixed(2)}m`)
      return false
    }
  }

  // Create the nodemailer transport object
  let transporter = {}
  if (!SMTP_SEND) {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: { ...testAccount }
    })
  } else {
    transporter = nodemailer.createTransport(SMTP_SIB_CONFIG)
  }

  // Send the email (using nodemailer)
  try {
    debug(`> Sending ${(!SMTP_SEND ? 'TEST' : '')} email to '${userInfo.email}'`)
    const mailInfo = await sendOneEmail(transporter, userInfo.email, fromEmail, subject, bodyTextMarkdown, userInfo)
    debug(`\t${!SMTP_SEND ? 'TEST ' : ''}Email sent:`, mailInfo.messageId)
    if (!SMTP_SEND) {
      debug('\tPreview URL:', nodemailer.getTestMessageUrl(mailInfo))
    }
  } catch (err) {
    debug('\tError sending email')
    debug(err)
    return false
  }

  // Return success
  return true
}

function sendOneEmail (transporter, to, from, subject, bodyText, templateData = {}) {
  // Fill in Handlebars template in body (if any)
  if (templateData && bodyText.match(/\{\{.*\}\}/)) {
    const msgTemplate = Handlebars.compile(bodyText)
    bodyText = msgTemplate(templateData)
  }

  // Render Markdown text as HTML
  const AST = MDReader.parse(bodyText)
  const bodyHTML = MDWriter.render(AST)

  // Send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      { from, to, subject, text: bodyText, html: bodyHTML },
      (err, info) => {
        if (err) { return reject(err) }
        return resolve(info)
      }
    )
  })
}
