export const LeaderIcon = ({ position }) => {
  switch (position) {
    case 1:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="24"
          viewBox="0 0 19 24"
          fill="none">
          <ellipse
            cx="9.34285"
            cy="14.6571"
            rx="9.34285"
            ry="9.34286"
            fill="#FACC48"
          />
          <path
            d="M2.3999 0H16.1999V2.82857C16.1999 2.82857 14.7428 4.32857 9.2999 4.32857C3.85704 4.32857 2.3999 2.82857 2.3999 2.82857V0Z"
            fill="#ECB541"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.2856 7.86434C9.97737 7.82195 9.66261 7.80005 9.34274 7.80005C5.55564 7.80005 2.4856 10.8701 2.4856 14.6572C2.4856 18.4443 5.55564 21.5143 9.34274 21.5143C9.66261 21.5143 9.97737 21.4924 10.2856 21.45V7.86434Z"
            fill="#ECB541"
          />
          <path
            d="M8.48229 18.0824L5.32701 14.9271C5.22653 14.8267 5.2299 14.6628 5.33442 14.5665L6.589 13.411C6.68997 13.318 6.84705 13.3238 6.94087 13.424L8.48406 15.0724C8.57927 15.1741 8.73925 15.1784 8.83973 15.0818L12.8115 11.2674C12.9087 11.1741 13.0623 11.1745 13.1589 11.2684L14.3017 12.3785C14.4025 12.4765 14.4028 12.6383 14.3023 12.7366L8.83386 18.0844C8.73592 18.1802 8.57915 18.1793 8.48229 18.0824Z"
            fill="white"
          />
        </svg>
      );
    case 2:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="24"
          viewBox="0 0 19 24"
          fill="none">
          <ellipse
            cx="9.34285"
            cy="14.6571"
            rx="9.34285"
            ry="9.34286"
            fill="#CCCCBE"
          />
          <path
            d="M2.3999 0H16.1999V2.82857C16.1999 2.82857 14.7428 4.32857 9.2999 4.32857C3.85704 4.32857 2.3999 2.82857 2.3999 2.82857V0Z"
            fill="#B3B39F"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.2856 7.86434C9.97737 7.82195 9.66261 7.80005 9.34274 7.80005C5.55564 7.80005 2.4856 10.8701 2.4856 14.6572C2.4856 18.4443 5.55564 21.5143 9.34274 21.5143C9.66261 21.5143 9.97737 21.4924 10.2856 21.45V7.86434Z"
            fill="#B3B39F"
          />
          <path
            d="M8.48229 18.0824L5.32701 14.9271C5.22653 14.8267 5.2299 14.6628 5.33442 14.5665L6.589 13.411C6.68997 13.318 6.84705 13.3238 6.94087 13.424L8.48406 15.0724C8.57927 15.1741 8.73925 15.1784 8.83973 15.0818L12.8115 11.2674C12.9087 11.1741 13.0623 11.1745 13.1589 11.2684L14.3017 12.3785C14.4025 12.4765 14.4028 12.6383 14.3023 12.7366L8.83386 18.0844C8.73592 18.1802 8.57915 18.1793 8.48229 18.0824Z"
            fill="white"
          />
        </svg>
      );
    case 3:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="24"
          viewBox="0 0 19 24"
          fill="none">
          <ellipse
            cx="9.34285"
            cy="14.6571"
            rx="9.34285"
            ry="9.34286"
            fill="#92A2A9"
          />
          <path
            d="M2.3999 0H16.1999V2.82857C16.1999 2.82857 14.7428 4.32857 9.2999 4.32857C3.85704 4.32857 2.3999 2.82857 2.3999 2.82857V0Z"
            fill="#72848C"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.2856 7.86434C9.97737 7.82195 9.66261 7.80005 9.34274 7.80005C5.55564 7.80005 2.4856 10.8701 2.4856 14.6572C2.4856 18.4443 5.55564 21.5143 9.34274 21.5143C9.66261 21.5143 9.97737 21.4924 10.2856 21.45V7.86434Z"
            fill="#72848C"
          />
          <path
            d="M8.48229 18.0824L5.32701 14.9271C5.22653 14.8267 5.2299 14.6628 5.33442 14.5665L6.589 13.411C6.68997 13.318 6.84705 13.3238 6.94087 13.424L8.48406 15.0724C8.57927 15.1741 8.73925 15.1784 8.83973 15.0818L12.8115 11.2674C12.9087 11.1741 13.0623 11.1745 13.1589 11.2684L14.3017 12.3785C14.4025 12.4765 14.4028 12.6383 14.3023 12.7366L8.83386 18.0844C8.73592 18.1802 8.57915 18.1793 8.48229 18.0824Z"
            fill="white"
          />
        </svg>
      );

    default:
      return position;
  }
};
