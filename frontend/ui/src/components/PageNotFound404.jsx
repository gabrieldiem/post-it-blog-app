const PageNotFound404 = () => {
  return (
    <div style={styles.html}>
      <div style={styles.body}>
        <h1 style={styles.h1}>Page Not Found</h1>
        <p style={styles.p}>Sorry, but the page you were trying to view does not exist.</p>
      </div>
    </div>
  );
};

const styles = {
  html: {
    color: '#888',
    display: 'table',
    fontFamily: 'sans-serif',
    height: '100%',
    textAlign: 'center',
    width: '100%',
    lineHeight: 1.2,
    margin: 0,
  },
  body: {
    display: 'table-cell',
    verticalAlign: 'middle',
    margin: '2em auto',
  },
  h1: {
    color: '#555',
    fontSize: '2em',
    fontWeight: 400,
  },
  p: {
    margin: '0 auto',
    width: '280px',
  },
  mediaQuery: `
    @media only screen and (max-width: 280px) {
      body, p {
        width: 95%;
      }
      h1 {
        font-size: 1.5em;
        margin: 0 0 0.3em;
      }
    }
  `,
};

export default PageNotFound404;
